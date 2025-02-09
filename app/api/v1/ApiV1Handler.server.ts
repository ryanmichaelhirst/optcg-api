import { HttpApiBuilder, HttpApiSwagger } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Layer } from "effect"
import { ApiV1Live } from "./ApiV1Http.server"

const ApiEnv = Layer.empty.pipe(
  Layer.provideMerge(ApiV1Live), // API logic
  Layer.provideMerge(HttpApiSwagger.layer().pipe(Layer.provide(ApiV1Live))), // Swagger docs
  Layer.provideMerge(NodeHttpServer.layerContext), //  Node.js HTTP
)

export const { dispose, handler } = HttpApiBuilder.toWebHandler(ApiEnv)
