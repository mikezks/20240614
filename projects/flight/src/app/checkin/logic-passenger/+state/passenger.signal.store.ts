import { inject } from '@angular/core';
import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { PassengerService } from '../data-access/passenger.service';
import { Passenger } from '../model/passenger';


const flightEntitiyState = {
  entities: {
    5: {
      id: 5,
      from: 'Barcelona',
      to: 'Stockholm',
      date: '',
      delayed: true
    }
  },
  ids: [5, 1, 9, 3]
};

export const PassengerStore = signalStore(
  { providedIn: 'root' },
  // State
  withEntities({ entity: type<Passenger>(), collection: 'passenger' }),
  // Updater
  withMethods(store => ({
    setPassengers: (state: { passengers: Passenger[] }) => patchState(store,
      setAllEntities(state.passengers, { collection: 'passenger' })),
  })),
  // Effects
  withMethods((
    store,
    passengerService = inject(PassengerService)
  ) => ({
    loadPassengers: rxMethod<{
      firstName: string,
      name: string
    }>(pipe(
      tap(console.log),
      switchMap(filter => passengerService.find(
        filter.firstName, filter.name
      )),
      tap(passengers => store.setPassengers({ passengers }))
    ))
  })),
);
