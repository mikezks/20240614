import { Flight } from "../../model/flight";
import { FlightFilter } from "../../model/flight-filter";
import { injectTicketStore } from "../signal-store/tickets.signal.store";
import { ticketActions } from "./actions";


export function injectTicketsFacade() {
  const store = injectTicketStore();

  return {
    flights: store.flightEntities,
    search: (filter: FlightFilter) =>
      store.dispatch(ticketActions.flightsLoad(filter)),
    update: (flight: Flight) =>
      store.dispatch(ticketActions.flightUpdate({ flight })),
    reset: () =>
      store.dispatch(ticketActions.flightsClear())
  };
}
