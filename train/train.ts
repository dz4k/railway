import { TrainID } from "../core/types"

export type Train = {
	id: TrainID
}

export type TrainState = 
	{ service: "not out" } |
	{ service: "running" } |
	{ service: "ended" } |
	{ service: "delayed", cause: string } |
	{ service: "canceled", cause: string }

/**
 * A status report for a train.
 */
export interface TrainStatus {
	train: Train

	/**
	 * The current state of the train.
	 */
	state: TrainState
	
	/**
	 * Distance between start of railway tracks and train location, km.
	 */
	lineTraveled: number

	/**
	 * Speed of train, km/h.
	 */
	speed: number
}

/**
 * Adapts train status data provided by sensors or customer's system to a 
 * common interface.
 */
export interface TrainStatusAdapter {
	subscribe(t: Train, callback: (t: TrainStatus) => void, closed: () => void): number | null
}
