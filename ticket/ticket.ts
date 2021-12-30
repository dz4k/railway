
interface Ticket {
    from: StationID
    to: StationID
    train: TrainID
}

interface TicketRepository {
    ticket(id: TicketID): Ticket | null
}
