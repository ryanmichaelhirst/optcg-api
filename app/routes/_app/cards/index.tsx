import { useCards } from "@/api/v1/hooks/cards"
import { db } from "@/lib/db.server"
import { app } from "@/utils/app.server"
import { LoaderFunctionArgs } from "@remix-run/node"
import { Either } from "effect"
import { typedjson } from "remix-typedjson"

export const loader = async (args: LoaderFunctionArgs) =>
  app(args).build(async (ctx) => {
    const cards = await db.card.findMany({
      take: 20,
    })

    return typedjson({ cards })
  })

export default function Page() {
  const cardsResp = useCards()
  const cards =
    cardsResp.data?.pipe(
      Either.match({
        onLeft: (error) => [],
        onRight: (value) => value.data,
      }),
    ) ?? []

  return (
    <div>
      <h1>Cards</h1>
      <div className="grid grid-cols-5 gap-4">
        {cards.map((card) => (
          <img src={card.image} key={card.id} className="rounded" />
        ))}
      </div>
    </div>
  )
}
