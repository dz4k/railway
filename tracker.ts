
import { TrainStatusAdapter, TrainStatus } from "./train/train"
import { RouteRepository, RouteStation } from "./route/route"
import { addAbortSignal } from "node:stream"

export default class RailwayTracker {
    private trains: TrainStatusAdapter
    private routes: RouteRepository
    private tickets: TicketRepository

    constructor(trains: TrainStatusAdapter, routes: RouteRepository, tickets: TicketRepository) {
        this.trains = trains
        this.routes = routes
        this.tickets = tickets
    }

    track(ticketID: TicketID, cb: (t: TrainReport) => void) {
        const ticket = this.tickets.ticket(ticketID)
        if (ticket == null) throw new NoTicket(`No such ticket ${ticketID}`)
        const train = { id: ticket.train }
        const route = this.routes.routeFor(train)

        if (route == null) throw new NoRoute(`No route for train ${train.id}`)

        let speed = 0
        let predictiveSpeed = 0
        let message: string | null = null
        this.trains.subscribe(train, (t: TrainStatus) => {
            const state = t.state
            if (state.service === "canceled" || state.service === "delayed") {
                message = state.cause
            }

            speed = t.speed
            if (speed != 0) predictiveSpeed = speed
            
            let stationsPast = [], stationAt = null, stationsAhead = [],
                from: RouteStation = null!, to: RouteStation = null!
            for (const station of route.stations) {
                if (station.stationId == ticket.from) {
                    from = station
                }
                if (station.stationId == ticket.to) {
                    to = station
                    break
                }

                if (station.distance < t.lineTraveled) 
                    stationsPast.push(station)
                else if (station.distance == t.lineTraveled)
                    stationAt = station
                else
                    stationsAhead.push(station)
            }

            cb({
                eta: 12,
                speed: speed,
                stationAt,
                stationsAhead,
                stationsPast,
                message: message,
                from,
                to,
            })
        })
    }

    eta(speed: number) {
        //
    }
}

export interface TrainReport {
    /**
     * Expected time of arrival, in minutes.
     */
    eta: number

    /**
     * Speed of train, in km/h.
     */
    speed: number

    /**
     * The stations passed by the train.
     */
    stationsPast: RouteStation[]

    /**
     * The station that the train is currently in.
     */
    stationAt: RouteStation | null

    /**
     * The stations ahead of the train.
     */
    stationsAhead: RouteStation[]

    /**
     * The start of the journey.
     */
    from: RouteStation

    /**
     * The destination of the journey.
     */
    to: RouteStation

    /**
     * Message for delay or cancellation, if any.
     */
    message: string | null
}
