import { db } from "@/lib/db.server"
import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { ApiV1 } from "../../../ApiV1"
import { serializeCard } from "../serializeCard"

export const cardsList = HttpApiBuilder.handler(ApiV1, "cards", "list", (args) =>
  Effect.gen(function* () {
    const where = {
      ...(args.urlParams.card_id && { code: args.urlParams.card_id }),
    }
    const cards = yield* Effect.promise(() =>
      db.card.findMany({
        take: 20,
      }),
    )

    const count = yield* Effect.promise(() => db.card.count({ where }))
    const data = yield* Effect.all(cards.map(serializeCard)).pipe(Effect.orDie)

    return {
      data,
      total: count,
      current_page: args.urlParams.page,
      per_page: args.urlParams.per_page,
      total_pages: Math.ceil(count | args.urlParams.per_page),
    }
  }),
)
