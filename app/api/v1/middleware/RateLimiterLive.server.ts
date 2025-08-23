import { Effect, Layer } from "effect"

import { RateLimiter } from "./RateLimiter"

// This middleware is meant to set request body in http context so that
// our express request logger middleware can access it and add request
// payload to api request logs at the end of each request.
export const RateLimiterLive = Layer.succeed(
  RateLimiter,
  RateLimiter.of(
    Effect.gen(function* () {
      return
    }),
  ),
)
