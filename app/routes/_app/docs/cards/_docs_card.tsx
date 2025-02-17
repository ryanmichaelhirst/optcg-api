import {
  ATTRIBUTES,
  CARD_CLASSES,
  CARD_SETS,
  CARD_TYPES,
  COLORS,
  COSTS,
  COUNTERS,
  POWERS,
  RARITIES,
} from "@/lib/onepiece"
import { ApiHeading, Properties, Property } from "./DocComponents"

export default function Page() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-1">Cards</h1>
        <p>Represents a physical card from the One Piece TCG.</p>
      </section>

      <section>
        <ApiHeading type="GET" path="/api/v1/cards" />
        <h3 className="my-3">List cards</h3>
        <div className="mb-10 text-muted-foreground">
          Retrieve a paginated list of cards. By default the list is sorted by card name in
          ascending order.
        </div>
        <h4>Query parameters</h4>
        <p>All query parameters are optional.</p>
        <p className="mb-4">
          page, per_page, search, color, set, type, cost, class, counter, power, rarity
        </p>
        <h4>Example request</h4>
        <p className="mb-4">
          https://optcgapi.ryanmichaelhirst.us/api/v1/cards?page=1&per_page=20&color=red&search=Monkey&rarity=L
        </p>
      </section>

      <section>
        <ApiHeading type="GET" path="/api/v1/cards/:id" />
        <h3 className="my-3">Get card</h3>
        <div className="mb-10 text-muted-foreground">Get a card by id.</div>
      </section>

      <section>
        <h3>Properties</h3>
        <Properties>
          <Property name="id" type="string">
            Unique identifier from db, e.g. card_1234
          </Property>
          <Property name="code" type="string">
            Serial # on card, e.g. OP01-001
          </Property>
          <Property name="rarity" type="string">
            Rarity, e.g. {RARITIES.join(" | ")}
          </Property>
          <Property name="type" type="string">
            Type, e.g. {CARD_TYPES.join(" | ")}
          </Property>
          <Property name="name" type="string">
            Name, e.g. Monkey D. Luffy
          </Property>
          <Property name="cost" type="number">
            Cost, e.g. {COSTS.join(" | ")}
          </Property>
          <Property name="attribute" type="string">
            Attribute, e.g. {ATTRIBUTES.join(" | ")}
          </Property>
          <Property name="power" type="number">
            Attack power, e.g. {POWERS.join(" | ")}
          </Property>
          <Property name="counter" type="number">
            Counter, e.g. {COUNTERS.join(" | ")}
          </Property>
          <Property name="color" type="string">
            Color, e.g. {COLORS.join(" | ")}
          </Property>
          <Property name="class" type="string">
            Class, e.g. {CARD_CLASSES.slice(0, 2).join(" | ")} | ...
          </Property>
          <Property name="effect" type="string">
            Effect description
          </Property>
          <Property name="set" type="string">
            Set name, e.g. {CARD_SETS.slice(0, 2).join(" | ")} | ...
          </Property>
          <Property name="image" type="string">
            Image url
          </Property>
        </Properties>
      </section>
    </div>
  )
}
