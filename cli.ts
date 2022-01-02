
import * as readline from "readline"
import { stdin, stdout } from "process"
import RailwayTracker, { TrainReport } from "./tracker"
import { TrainStatusAdapter } from "./train/train"
import { RouteRepository } from "./route/route"
import { TicketRepository } from "./ticket/ticket"
import { clear } from "console"

let rl: readline.Interface

export default async function runCommandLine(
    trains: TrainStatusAdapter, routes: RouteRepository, tickets: TicketRepository) {
    rl = readline.createInterface({ input: stdin, output: stdout })
    
    const code = await ask("Please enter the code on your ticket: ")
    const tracker = new RailwayTracker(code, trains, routes, tickets);
    tracker.track(printReport)
    rl.close()
}

async function printReport(r: TrainReport) {
    clear()
    console.log(`${spaces(75)}ETA:   ${r.eta ?? '--'} min.`)
    console.log(`${spaces(75)}Speed: ${r.speed} km/h`)

    let map = ""
    for (const station of r.stationsPast.slice(-3)) {
        map += `===[${station.displayName}]`
    }
    map = spaces(72 - map.length) + map
    if (r.stationAt) {
        map += `===[🚄 ${r.stationAt.displayName}]---`
    } else {
        map += `===🚄---`
    }
    for (const station of r.stationsAhead.slice(0, 3)) {
        map += `[${station.displayName}]---`
    }
    console.log(map)
}

function ask(q: string): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question(q, resolve)
    })
}

function spaces(n: number) {
    return Array(Math.abs(n)).fill(' ').join('')
}
