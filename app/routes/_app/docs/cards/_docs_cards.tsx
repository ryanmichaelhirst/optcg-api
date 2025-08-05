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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Cards API
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Access One Piece TCG card data through our REST API endpoints.
        </p>
      </section>

      {/* List Cards Endpoint */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <ApiHeading type="GET" path="/api/v1/cards" />
          <h3 className="text-2xl font-semibold text-gray-900 mt-4 mb-3">List Cards</h3>
          <p className="text-gray-700 mb-6">
            Retrieve a paginated list of cards. By default, results are sorted by card name in ascending order.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Query Parameters</h4>
              <p className="text-gray-600 mb-3">All parameters are optional:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  page
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  per_page
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  search
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  color
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  set
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  type
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  cost
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  class
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  counter
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  power
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  rarity
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Example Request</h4>
              <div className="bg-gray-900 rounded-lg p-4">
                <span className="text-gray-400 font-mono text-sm block">
                  https://optcg-api.ryanmichaelhirst.us/api/v1/cards?page=1&per_page=20&color=red&search=Monkey&rarity=L
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Card Endpoint */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
          <ApiHeading type="GET" path="/api/v1/cards/:id" />
          <h3 className="text-2xl font-semibold text-gray-900 mt-4 mb-3">Get Card by ID</h3>
          <p className="text-gray-700">
            Retrieve a specific card by its unique identifier.
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <section className="space-y-6">
        <h3 className="text-3xl font-semibold text-gray-900">Card Properties</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <Properties>
            <Property name="id" type="string">
              Unique identifier from database, e.g. card_1234
            </Property>
            <Property name="code" type="string">
              Serial number on card, e.g. OP01-001
            </Property>
            <Property name="rarity" type="string">
              Card rarity, e.g. {RARITIES.join(" | ")}
            </Property>
            <Property name="type" type="string">
              Card type, e.g. {CARD_TYPES.join(" | ")}
            </Property>
            <Property name="name" type="string">
              Card name, e.g. Monkey D. Luffy
            </Property>
            <Property name="cost" type="number">
              Card cost, e.g. {COSTS.join(" | ")}
            </Property>
            <Property name="attribute" type="string">
              Card attribute, e.g. {ATTRIBUTES.join(" | ")}
            </Property>
            <Property name="power" type="number">
              Attack power, e.g. {POWERS.join(" | ")}
            </Property>
            <Property name="counter" type="number">
              Counter value, e.g. {COUNTERS.join(" | ")}
            </Property>
            <Property name="color" type="string">
              Card color, e.g. {COLORS.join(" | ")}
            </Property>
            <Property name="class" type="string">
              Card class, e.g. {CARD_CLASSES.slice(0, 2).join(" | ")} | ...
            </Property>
            <Property name="effect" type="string">
              Card effect description
            </Property>
            <Property name="set" type="string">
              Set name, e.g. {CARD_SETS.slice(0, 2).join(" | ")} | ...
            </Property>
            <Property name="image" type="string">
              Card image URL
            </Property>
          </Properties>
        </div>
      </section>


    </div>
  )
}
