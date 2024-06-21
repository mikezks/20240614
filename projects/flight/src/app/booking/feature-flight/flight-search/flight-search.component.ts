import { CommonModule } from '@angular/common';
import { Component, NgZone, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { signalState } from '@ngrx/signals';
import { Flight, injectTicketsFacade } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';


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
  private ngZone = inject(NgZone);

  protected localState = signalState({
    filter: {
      from: 'London',
      to: 'San Francisco',
      urgent: false
    },
    basket: {} as Record<number, boolean>,
    flights: [] as Flight[]
  });

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
    effect(() => {
      this.filter();
      untracked(() => this.search());
    });
    console.log(this.ngZone);
  }

  protected search(): void {
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
