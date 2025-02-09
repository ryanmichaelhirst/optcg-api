import { HttpApiBuilder } from "@effect/platform"
import { ApiV1 } from "../../ApiV1"
import { cardsFindById } from "./handlers/cards.findById.server"
import { cardsList } from "./handlers/cards.list.server"

export const CardsApiLive = HttpApiBuilder.group(ApiV1, "cards", (handlers) => {
  return handlers.handle("list", cardsList).handle("findById", cardsFindById)
})
