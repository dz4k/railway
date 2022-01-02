import { StationID, TicketID, TrainID } from "../core/types";

export interface Ticket {
    from: StationID
    to: StationID
    train: TrainID
}

export interface TicketRepository {
    ticket(id: TicketID): Ticket | null
}
