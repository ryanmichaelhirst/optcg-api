import { HttpApi, OpenApi } from "@effect/platform"

import { CardsApi } from "@/api/v1/resources/cards/CardsApi"

export class ApiV1 extends HttpApi.make("ApiV1")
  .add(CardsApi)
  .prefix("/api/v1")
  .annotateContext(
    OpenApi.annotations({
      title: "API v1",
      description: "V1 api for the One Piece TCG",
    }),
  ) {}
