import MockRouteRepository from "./route/mock-repository"
import MockTicketRepository from "./ticket/mock-repository"
import RailwayTracker, { TrainReport } from "./tracker"
import MockTrainStatusAdapter from "./train/mock-adapter"

import * as express from "express"
import * as nunjucks from "nunjucks"
import { TicketID } from "./core/types"
import { Ticket } from "./ticket/ticket"

const trains = new MockTrainStatusAdapter
const routes = new MockRouteRepository
const tickets = new MockTicketRepository

const app = express()

app.use(express.static('public'))
nunjucks.configure('views', {
    express: app,
    autoescape: true,
})

app.get('/', (req, res) => {
    res.render('index.njk')
})

function validateTicket(ticketId: TicketID): Ticket | string {
    if (!ticketId) return 'Please enter your code'
    const ticket = tickets.ticket(ticketId)
    if (!ticket) return 'Invalid code'
    return ticket
}

app.get('/track', (req, res) => {
    const ticketId = req.query['ticket'] as string
    const valid = validateTicket(ticketId)
    if (typeof valid === 'string') res.render('err.njk', { error: valid })
    else res.render('tracker.njk', {
        ticket: valid,
        ticketId,
        route: routes.routeFor({ id: valid.train })
    })
})

app.get('/track/stream', (req, res) => {
    const ticketId = req.query['ticket'] as string
    const ticket = validateTicket(ticketId)
    if (typeof ticket === 'string') return res.render('err.njk', { error: ticket, bare: true })
    
    const tracker = new RailwayTracker(ticketId, trains, routes, tickets)

    // Headers as per Server Sent Events spec
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type',  'text/event-stream')
    res.setHeader('Connection',    'keep-alive')
    res.flushHeaders()

    res.write('retry: 8000\n\n')

    const onReport = (e: Event) => {
        // @ts-ignore
        const r = e.detail as TrainReport
        console.log('sending')
        res.write('event: report\n' +
                  `data: ${nunjucks.render('track-stream.njk', { report: r })}\n\n`)
    }

    tracker.addEventListener('report', onReport)
    tracker.addEventListener('closed', function listener() {
        tracker.removeEventListener('report', onReport)
        tracker.removeEventListener('closed', listener)
        res.end()
    })
})

app.listen(8080)