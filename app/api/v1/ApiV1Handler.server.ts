import { HttpApiBuilder } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Layer } from "effect"
import { ApiV1Live } from "./ApiV1Http.server"
const ApiEnv = ApiV1Live.pipe()

const EnvLive = Layer.empty.pipe(
  Layer.provideMerge(Layer.mergeAll(ApiEnv, NodeHttpServer.layerContext)),
)

export const { dispose, handler } = HttpApiBuilder.toWebHandler(EnvLive)
