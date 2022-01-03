import { Train, TrainStatusAdapter, TrainStatus } from "./train";

export default class MockTrainStatusAdapter implements TrainStatusAdapter {
    constructor() {}
    
    subscribe(t: Train, callback: (t: TrainStatus) => void, closed: () => void): number {
        if (t.id === '2323512') {
            this._fakeTrain(t, callback, closed)
        }
        return -1;
    }

    _fakeTrain(t: Train, callback: (t: TrainStatus) => void, closed: () => void) {
        let traveled = 20;
        (function loop() {
            if (traveled < 390) setTimeout(loop, 1000 + Math.random() * 400)
            else closed()
            callback({
                train: t,
                state: { service: "running" },
                lineTraveled: traveled += 5,
                speed: 240
            })
        })()
    }
}