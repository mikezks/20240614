import { createReduxState, mapAction, reduxMethod, withActionMappers } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, type, withComputed, withMethods } from '@ngrx/signals';
import { removeAllEntities, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { map, pipe, switchMap, tap } from 'rxjs';
import { Flight } from '../../model/flight';
import { FlightService } from '../../data-access/flight.service';
import { FlightFilter } from '../../model/flight-filter';
import { ticketActions } from '../common/actions';


export const TicketStore = signalStore(
  { providedIn: 'root' },
  // State
  withEntities({ entity: type<Flight>(), collection: 'flight' }),
  withEntities({ entity: type<number>(), collection: 'hide' }),
  // Selectors
  withComputed(({ flightEntities, hideEntities }) => ({
    filteredFlights: computed(() => flightEntities()
      .filter(flight => !hideEntities().includes(flight.id))),
    flightCount: computed(() => flightEntities().length),
  })),
  // Updater
  withMethods(store => ({
    setFlights: (state: { flights: Flight[] }) => patchState(store,
      setAllEntities(state.flights, { collection: 'flight' })),
    updateFlight: (state: { flight: Flight }) => patchState(store,
      updateEntity({ id: state.flight.id, changes: state.flight }, { collection: 'flight' })),
    clearFlights: () => patchState(store,
      removeAllEntities({ collection: 'flight' })),
  })),
  // Effects
  withMethods((store, flightService = inject(FlightService)) => ({
    loadFlights: reduxMethod<FlightFilter, { flights: Flight[] }>(pipe(
      switchMap(filter => flightService.find(filter.from, filter.to, filter.urgent)),
      map(flights => ({ flights })),
      tap(flights => console.log('Ticket Signal Store loaded Flights', flights))
    ), store.setFlights),
  })),
);

export const { provideTicketStore, injectTicketStore } =
  /**
   * Redux
   *  - Provider
   *  - Injectable Store
   *  - Action to Method Mapper
   *  - Selector Signals
   *  - Dispatch
   */
  createReduxState('ticket', TicketStore, store => withActionMappers(
    mapAction(ticketActions.flightsLoad, store.loadFlights, ticketActions.flightsLoaded),
    mapAction(ticketActions.flightsLoaded, ticketActions.flightsLoadedByPassenger, store.setFlights),
    mapAction(ticketActions.flightUpdate, store.updateFlight),
    mapAction(ticketActions.flightsClear, store.clearFlights),
  )
);
