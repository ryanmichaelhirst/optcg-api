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
        }),
      )
      .addSuccess(buildPaginationResult(Card)),
  )
  .add(
    HttpApiEndpoint.get("findById", "/cards/:id")
      .setUrlParams(
        Schema.Struct({
          id: Schema.String,
        }),
      )
      .addSuccess(Card)
      .addError(NotFound),
  ) {}
