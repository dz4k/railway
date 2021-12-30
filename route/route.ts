
import { Train } from "../train/train"

/**
 * A route on which a train may run.
 */
export interface Route {
	/**
	 * The passenger-readable name for this station.
	 */
	displayName: string

	/**
	 * The stations visited by the route.
	 */
	stations: RouteStation[]
}

/**
 * A stop on a particular route.
 */
export interface RouteStation {
	/**
	 * The identifier for the line. Note that different RouteStation instances
	 * may have the same stationID, but represent stops on different routes.
	 */
	stationId: string

	/**
	 * The passenger-readable name for this station.
	 */
	displayName: string

	/**
	 * Distance from start of tracks, in kilometers.
	 */
	distance: number
}

export interface RouteRepository {
	routeFor(train: Train): Route | null
}
