import { db } from "@/lib/db.server"
import { HttpApiBuilder } from "@effect/platform"
import { NotFound } from "@effect/platform/HttpApiError"
import { Effect } from "effect"
import { ApiV1 } from "../../../ApiV1"
import { rateLimiterMiddleware } from "../../../middleware/rateLimiter.server"
import { serializeCard } from "../serializeCard"

const cardsFindByIdHandler = (args: any) =>
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
  })

export const cardsFindById = HttpApiBuilder.handler(ApiV1, "cards", "findById", rateLimiterMiddleware(cardsFindByIdHandler))
