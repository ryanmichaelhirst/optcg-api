import { Schema } from "effect"

export class Card extends Schema.TaggedClass<Card>()("Card", {
  id: Schema.String,
  code: Schema.String,
  rarity: Schema.String,
  type: Schema.String,
  name: Schema.String,
  cost: Schema.UndefinedOr(Schema.NullOr(Schema.Number)),
  attribute: Schema.String,
  power: Schema.UndefinedOr(Schema.NullOr(Schema.Number)),
  counter: Schema.UndefinedOr(Schema.NullOr(Schema.Number)),
  color: Schema.String,
  class: Schema.String,
  effect: Schema.UndefinedOr(Schema.NullOr(Schema.String)),
  set: Schema.String,
  image: Schema.String,
}) {}
