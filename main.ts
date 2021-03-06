
import MockTrainStatusAdapter from "./train/mock-adapter"
import MockRouteRepository from "./route/mock-repository"
import MockTicketRepository from "./ticket/mock-repository"
import runCommandLine from "./cli"

const trains = new MockTrainStatusAdapter
const routes = new MockRouteRepository
const tickets = new MockTicketRepository

runCommandLine(trains, routes, tickets)
