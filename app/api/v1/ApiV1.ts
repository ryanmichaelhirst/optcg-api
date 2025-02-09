import { HttpApi, OpenApi } from "@effect/platform"

import { CardsApi } from "@/api/v1/resources/cards/CardsApi"

export const API_PATH = "/api/v1"

export class ApiV1 extends HttpApi.make("ApiV1")
  .add(CardsApi)
  .prefix(API_PATH)
  .annotateContext(
    OpenApi.annotations({
      title: "API V1",
      description: "Public API V1",
    }),
  ) {}
