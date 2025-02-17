import { db } from "@/lib/db.server"
import { HttpApiBuilder } from "@effect/platform"
import { NotFound } from "@effect/platform/HttpApiError"
import { Effect } from "effect"
import { ApiV1 } from "../../../ApiV1"
import { serializeCard } from "../serializeCard"

export const cardsFindById = HttpApiBuilder.handler(ApiV1, "cards", "findById", (args) =>
  Effect.gen(function* () {
    const card = yield* Effect.promise(() =>
      db.card.findFirst({
        where: {
          code: args.urlParams.id,
        },
      }),
    )

    if (!card) {
      return yield* new NotFound()
    }

    return yield* serializeCard(card).pipe(Effect.die)
  }),
)
