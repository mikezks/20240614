import { inject } from '@angular/core';
import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
import { removeAllEntities, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { PassengerService } from '../data-access/passenger.service';
import { Passenger } from '../model/passenger';



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const flights = {
  entities: {
    1: {
      id: 999,
      from: 'Wien',
      to: 'Madrid',
      date: new Date().toISOString(),
      delayed: true
    }
  },
  ids: [1]
}


export const PassengerStore = signalStore(
  { providedIn: 'root' },
  // State
  withEntities({ entity: type<Passenger>(), collection: 'passenger' }),
  // Updater
  withMethods(store => ({
    setPassengers: (state: { passengers: Passenger[] }) => patchState(store,
      setAllEntities(state.passengers, { collection: 'passenger' })),
    deletePassengers: () => patchState(store,
      removeAllEntities({ collection: 'passenger' })),
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
