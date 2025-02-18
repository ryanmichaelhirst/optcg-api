import { db } from "@/lib/db.server"
import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { ApiV1 } from "../../../ApiV1"
import { serializeCard } from "../serializeCard"

export const cardsList = HttpApiBuilder.handler(ApiV1, "cards", "list", (args) =>
  Effect.gen(function* () {
    const where = buildWhere(args.urlParams)
    const orderBy = args.urlParams.order_by as any
    const orderDir = args.urlParams.order_dir as any

    const cards = yield* Effect.promise(() =>
      db.card.findMany({
        where,
        take: args.urlParams.per_page,
        skip: (args.urlParams.page - 1) * args.urlParams.per_page,
        orderBy: {
          ...(orderBy && orderDir
            ? {
                [orderBy]: orderDir,
              }
            : { code: "asc" }),
        },
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

function buildWhere(args: {
  page?: number
  per_page?: number
  search?: string | null
  color?: string | null
  set?: string | null
  type?: string | null
  cost?: number | null
  class?: string | null
  counter?: number | null
  power?: number | null
  rarity?: string | null
  card_ids?: readonly string[] | null
}) {
  return {
    ...(args.search && {
      OR: [
        { code: { contains: args.search, mode: "insensitive" as const } }, // EB01-001
        { name: { contains: args.search, mode: "insensitive" as const } }, // "Kozuki Oden"
        { attribute: { contains: args.search, mode: "insensitive" as const } }, // "Slash"
        { class: { contains: args.search, mode: "insensitive" as const } }, // "Land of Wano/Kouzuki Clan"
        { effect: { contains: args.search, mode: "insensitive" as const } }, // "All of your {Land of Wano} type Character cards without a Counter..."
        { set: { contains: args.search, mode: "insensitive" as const } }, // "-Memorial Collection-[EB-01]"
      ],
    }),
    ...(args.color && { color: { contains: args.color, mode: "insensitive" as const } }),
    ...(args.set && { set: { contains: args.set, mode: "insensitive" as const } }),
    ...(args.type && { type: { contains: args.type, mode: "insensitive" as const } }),
    ...(args.cost && { cost: args.cost }),
    ...(args.class && { class: { contains: args.class, mode: "insensitive" as const } }),
    ...(args.counter && { counter: args.counter }),
    ...(args.power && { power: args.power }),
    ...(args.rarity && { rarity: { contains: args.rarity, mode: "insensitive" as const } }),
    ...(args.card_ids && { code: { in: Array.from(args.card_ids) } }),
  }
}
