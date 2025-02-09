import { ApiV1 } from "@/api/v1/ApiV1"
import { HttpApiBuilder } from "@effect/platform"
import { Layer } from "effect"
import { CardsApiLive } from "./resources/cards/CardsHttp.server"

export const ApiV1Live = HttpApiBuilder.api(ApiV1).pipe(Layer.provide(CardsApiLive))
