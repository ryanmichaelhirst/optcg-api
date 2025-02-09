import { FetchHttpClient, HttpApiClient } from "@effect/platform"
import { Context, Effect, Layer } from "effect"

import { ApiV1 } from "./ApiV1"

const make = HttpApiClient.make(ApiV1).pipe(Effect.provide(FetchHttpClient.layer))

export class ApiV1Client extends Context.Tag("@/ApiV1Client")<
  ApiV1Client,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make)
}
