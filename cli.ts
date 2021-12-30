
import * as readline from "readline"
import { stdin, stdout } from "process"
import RailwayTracker from "./tracker"

let rl: readline.Interface

export default async function runCommandLine(tracker: RailwayTracker) {
    rl = readline.createInterface({ input: stdin, output: stdout })

    const code = await ask("Please enter the code on your ticket.")
    tracker.track(code, (r) => {
        readline.clearLine(stdout, -1)
        console.log('🚄', r.stationsAhead.map(station => station.displayName).join(', '));
    })
    rl.close()
}

function ask(q: string): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question(q, resolve)
    })
}
