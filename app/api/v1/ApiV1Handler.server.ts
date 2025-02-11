import { HttpApiBuilder, HttpApiSwagger } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Layer } from "effect"
import { ApiV1Live } from "./ApiV1Http.server"

const ApiEnv = Layer.empty.pipe(
  // API logic
  Layer.provideMerge(ApiV1Live),
  // Swagger docs
  Layer.provideMerge(
    HttpApiSwagger.layer({
      path: "/swagger",
    }).pipe(Layer.provide(ApiV1Live)),
  ),
  // HTTP context
  Layer.provideMerge(NodeHttpServer.layerContext),
)

export const { dispose, handler } = HttpApiBuilder.toWebHandler(ApiEnv)
