import type { Card as TCard } from "@prisma/client"
import { Effect } from "effect"
import { Card } from "./Card"

export const serializeCard = (card: TCard) => {
  return Effect.gen(function* () {
    return Card.make({
      id: card.code,
      uid: card.uid,
      code: card.code,
      rarity: card.rarity,
      type: card.type,
      name: card.name,
      cost: card.cost,
      attribute: card.attribute,
      power: card.power,
      counter: card.counter,
      color: card.color,
      class: card.class,
      set: card.set,
      image: card.image,
      effect: card.effect,
    })
  })
}
