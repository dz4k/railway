import { Train, TrainStatusAdapter, TrainStatus } from "./train";

export default class MockTrainStatusAdapter implements TrainStatusAdapter {
    constructor() {}
    
    subscribe(t: Train, callback: (t: TrainStatus) => void): number {
        if (t.id === '2323512') {
            this._fakeTrain(t, callback)
        }
        return -1;
    }

    _fakeTrain(t: Train, callback: (t: TrainStatus) => void) {
        let traveled = 20;
        (function loop() {
            setTimeout(loop, 10000 + Math.random() * 4000)
            callback({
                train: t,
                state: { service: "running" },
                lineTraveled: traveled += 20,
                speed: 240
            })
        })()
    }
}