import MockRouteRepository from "./route/mock-repository"
import MockTicketRepository from "./ticket/mock-repository"
import RailwayTracker from "./tracker"
import MockTrainStatusAdapter from "./train/mock-adapter"

const trains = new MockTrainStatusAdapter
const routes = new MockRouteRepository
const tickets = new MockTicketRepository
