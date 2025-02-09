import { Schema } from "effect"

export const PaginationQuery = Schema.Struct({
  page: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.clamp(1, 1000)), {
    default: () => 1,
  }),
  per_page: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.clamp(1, 100)), {
    default: () => 20,
  }),
})

export type PaginationQuery = typeof PaginationQuery

export const buildPaginationResult = <T extends Schema.Schema.Any>(schema: T) => {
  return Schema.Struct({
    data: Schema.Array(schema),
    total: Schema.Number,
    current_page: Schema.Number,
    per_page: Schema.Number,
    total_pages: Schema.optional(Schema.Number),
  })
}
