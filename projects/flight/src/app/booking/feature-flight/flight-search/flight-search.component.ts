import { CommonModule } from '@angular/common';
import { Component, Injector, computed, effect, inject, runInInjectionContext, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, FlightFilter, injectTicketsFacade } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';
import { SIGNAL } from '@angular/core/primitives/signals';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private ticketsFacade = injectTicketsFacade();
  private injector = inject(Injector);

  protected filter = signal({
    from: 'London',
    to: 'San Francisco',
    urgent: false
  });
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights = this.ticketsFacade.flights;
  protected flightRoute = computed(
    () => 'From ' + this.filter().from + ' to ' + this.filter().to + '.'
  );

  constructor() {
    effect(() => console.log(this.flightRoute()));

    this.filter.update(filter => ({
      ...filter,
      from: 'Barcelona'
    }));
    this.filter.update(filter => ({
      ...filter,
      from: 'Madrid'
    }));
    this.filter.update(filter => ({
      ...filter,
      from: 'Rome'
    }));
    this.filter.update(filter => ({
      ...filter,
      from: 'St. Gallen'
    }));

    console.log(this.flightRoute[SIGNAL]);
  }

  protected search(filter: FlightFilter): void {
    runInInjectionContext(
      this.injector,
      () =>effect(() => console.log(this.flightRoute()))
    );

    this.filter.set(filter);

    if (!this.filter().from || !this.filter().to) {
      return;
    }

    this.ticketsFacade.search(this.filter());
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.ticketsFacade.update(newFlight);
  }

  protected reset(): void {
    this.ticketsFacade.reset();
  }
}
