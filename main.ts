
import MockTrainStatusAdapter from "./train/mock-adapter"
import MockRouteRepository from "./route/mock-repository"
import MockTicketRepository from "./ticket/mock-repository"
import RailwayTracker from "./tracker"
import runCommandLine from "./cli"

const trains = new MockTrainStatusAdapter
const routes = new MockRouteRepository
const tickets = new MockTicketRepository

const tracker = new RailwayTracker(trains, routes, tickets)

runCommandLine(tracker)
