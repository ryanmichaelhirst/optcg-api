import { db } from "@/lib/db.server"
import { Effect } from "effect"
import { seedCards } from "prisma/seed-cards"

// Removes all cards from db and re-seed
const program = Effect.gen(function* () {
  yield* Effect.promise(() => db.card.deleteMany({}))
  yield* Effect.promise(() => seedCards())
})

Effect.runPromiseExit(program).then(console.log)
