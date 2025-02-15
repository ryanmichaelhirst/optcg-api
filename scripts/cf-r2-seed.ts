import { Effect } from "effect"

const program = Effect.gen(function* () {})

Effect.runPromiseExit(program).then(console.log)
