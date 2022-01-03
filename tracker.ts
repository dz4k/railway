import { TicketID, TrainID } from "./core/types"
import { TrainStatusAdapter, TrainStatus, Train } from "./train/train"
import { Route, RouteRepository, RouteStation } from "./route/route"
import { Ticket, TicketRepository } from "./ticket/ticket"
import { addAbortSignal } from "node:stream"
import { NoRoute, NoTicket } from "./core/errors"

export default class RailwayTracker extends EventTarget {
    private trains: TrainStatusAdapter
    private routes: RouteRepository
    private tickets: TicketRepository

    private ticket: Ticket
    private train: Train
    private route: Route

    constructor(ticketID: TicketID, trains: TrainStatusAdapter, routes: RouteRepository, tickets: TicketRepository) {
        super()
        this.trains = trains
        this.routes = routes
        this.tickets = tickets
        const ticket = this.tickets.ticket(ticketID)
        if (ticket == null) throw new NoTicket(`No such ticket ${ticketID}`)
        else this.ticket = ticket

        this.train = { id: this.ticket.train }
        
        const route = this.routes.routeFor(this.train)
        if (route == null) throw new NoRoute(`No route for train ${this.train.id}`)
        else this.route = route
        this.track((t) => {
            this.dispatchEvent(Object.assign(new Event("report"), { detail: t }))
        })
    }

    track(cb: (t: TrainReport) => void) {
        let speed = 0
        let predictiveSpeed = 0
        let message: string | null = null
        this.trains.subscribe(this.train, (t: TrainStatus) => {
            const state = t.state
            if (state.service === "canceled" || state.service === "delayed") {
                message = state.cause
            }

            speed = t.speed
            if (speed != 0) predictiveSpeed = speed
            
            let stationsPast = [], stationAt = null, stationsAhead = [],
                from: RouteStation = null!, to: RouteStation = null!
            for (const station of this.route.stations) {
                if (station.stationId == this.ticket.from) {
                    from = station
                }
                if (station.stationId == this.ticket.to) {
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
                eta: this.eta(speed, t.lineTraveled, to.distance),
                speed: speed,
                stationAt,
                stationsAhead,
                stationsPast,
                message: message,
                from,
                to,
            })
        }, () => {
            this.dispatchEvent(new Event('closed'))
        })
    }

    eta(speed: number, from: number, to: number) {
        return ((to - from) / speed) * 60
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
