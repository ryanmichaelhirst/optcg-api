import { ManagedRuntime } from "effect"
import { ApiV1Client } from "./ApiV1Client"

// Runtime for API V1 usage in hooks. This runtime will be used to run the effects
// and will have the ApiV1Client injected
export const ApiV1Runtime = ManagedRuntime.make(ApiV1Client.Live)
