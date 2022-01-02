import { TicketID } from "../core/types"
import { Ticket, TicketRepository } from "./ticket"

const tickets: { [_: string]: Ticket } = {
    '2131245': {
        from: 'ANK',
        to: 'IHL',
        train: '2323512'
    }
}

export default class MockTicketRepository implements TicketRepository {
    constructor() {}

    ticket(id: TicketID): Ticket | null {
        return tickets[id] ?? null
    }
}
