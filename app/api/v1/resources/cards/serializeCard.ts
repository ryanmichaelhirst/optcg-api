import type { Card as TCard } from "@prisma/client"
import { Config, Effect } from "effect"
import { Card } from "./Card"

export const serializeCard = (card: TCard) => {
  return Effect.gen(function* () {
    const CDN_URL = yield* Config.string("CF_CDN_URL")
    const pngFilename = getFilename(card.image, card.code)

    return Card.make({
      id: card.uid,
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
      image: `${CDN_URL}/${pngFilename}`,
      effect: card.effect,
    })
  })
}

function getFilename(url: string, code: string) {
  const match = url.match(/card\/([^?]+)/)
  return match ? match[1] : code
}
