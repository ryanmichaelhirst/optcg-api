import { db } from "@/lib/db.server"
import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { ApiV1 } from "../../../ApiV1"
import { serializeCard } from "../serializeCard"

export const cardsList = HttpApiBuilder.handler(ApiV1, "cards", "list", (args) =>
  Effect.gen(function* () {
    const { search } = args.urlParams

    const where = search
      ? {
          OR: [
            { code: { contains: search, mode: "insensitive" as const } }, // EB01-001
            { name: { contains: search, mode: "insensitive" as const } }, // "Kozuki Oden"
            { attribute: { contains: search, mode: "insensitive" as const } }, // "Slash"
            { class: { contains: search, mode: "insensitive" as const } }, // "Land of Wano/Kouzuki Clan"
            { effect: { contains: search, mode: "insensitive" as const } }, // "All of your {Land of Wano} type Character cards without a Counter..."
            { set: { contains: search, mode: "insensitive" as const } }, // "-Memorial Collection-[EB-01]"
          ],
        }
      : {}

    const cards = yield* Effect.promise(() =>
      db.card.findMany({
        where,
        take: args.urlParams.per_page,
        skip: (args.urlParams.page - 1) * args.urlParams.per_page,
        orderBy: { code: "asc" },
      }),
    )

    const total = yield* Effect.promise(() => db.card.count({ where }))
    const data = yield* Effect.all(cards.map(serializeCard)).pipe(Effect.orDie)

    return {
      data,
      total,
      current_page: args.urlParams.page,
      per_page: args.urlParams.per_page,
      total_pages: Math.ceil(total / args.urlParams.per_page),
    }
  }),
)
