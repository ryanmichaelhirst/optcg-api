import { PaginationQuery, buildPaginationResult } from "@/api/shared/Pagination"
import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { NotFound } from "@effect/platform/HttpApiError"
import { Schema } from "effect"
import { Card } from "./Card"

export class CardsApi extends HttpApiGroup.make("cards")
  .add(
    HttpApiEndpoint.get("list", "/cards")
      .setUrlParams(
        Schema.Struct({
          ...PaginationQuery.fields,
          search: Schema.optional(Schema.String),
          color: Schema.optional(Schema.String),
          set: Schema.optional(Schema.String),
          type: Schema.optional(Schema.String),
          cost: Schema.optional(Schema.NumberFromString),
          class: Schema.optional(Schema.String),
          counter: Schema.optional(Schema.NumberFromString),
          power: Schema.optional(Schema.NumberFromString),
          rarity: Schema.optional(Schema.String),
        }),
      )
      .addSuccess(buildPaginationResult(Card)),
  )
  .add(
    HttpApiEndpoint.get("findById", "/cards/:id")
      .setPath(
        Schema.Struct({
          id: Schema.String,
        }),
      )
      .addSuccess(Card)
      .addError(NotFound),
  ) {}
