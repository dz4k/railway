
import * as readline from "readline"
import { stdin, stdout } from "process"
import RailwayTracker, { TrainReport } from "./tracker"

let rl: readline.Interface

export default async function runCommandLine(tracker: RailwayTracker) {
    rl = readline.createInterface({ input: stdin, output: stdout })

    const code = await ask("Please enter the code on your ticket.")
    tracker.track(code, printReport)
    rl.close()
}

function printReport(r: TrainReport) {
    readline.clearLine(stdout, -1)
    readline.clearLine(stdout, -1)
    readline.clearLine(stdout, -1)
    
    console.log(`ETA:   ${r.eta ?? '--'}`)
    console.log(`Speed: ${r.speed} km/h`)

    for (const station of r.stationsPast.slice(-3)) {
        stdout.write(`===${station.displayName}`)
    }
    if (r.stationAt) {
        stdout.write(`===[🚄 ${r.stationAt.displayName}]===`)
    } else {
        stdout.write(`=🚄=`)
    }


    for (const station of r.stationsPast.slice(0, 3)) {
        stdout.write(`${station.displayName}===`)
    }

    stdout.write('===\n')
}

function ask(q: string): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question(q, resolve)
    })
}
