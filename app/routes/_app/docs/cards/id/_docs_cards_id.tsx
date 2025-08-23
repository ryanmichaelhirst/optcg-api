import { CopyButton } from "@/components/CopyButton"
import { Badge } from "@/components/ui/badge"
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

export default function GetCardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <h1 className="text-5xl font-bold text-white">Get Card by ID</h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
          Retrieve detailed information about a specific card by its unique identifier.
        </p>
      </section>

      {/* Endpoints Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Endpoints</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4">
            <Badge variant="secondary" className="bg-green-600 px-3 py-1 text-white">
              GET
            </Badge>
            <span className="flex-1 font-mono text-white">/api/v1/cards/{"{id}"}</span>
            <CopyButton text="/api/v1/cards/{id}" className="text-gray-400 hover:text-white" />
          </div>
        </div>

        {/* Example Request Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Example Request</h3>
          <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
              <span className="text-sm text-gray-400">cURL</span>
              <CopyButton
                text="curl https://optcg-api.ryanmichaelhirst.us/api/v1/cards/card_1234"
                className="p-1 text-gray-400 hover:text-white"
              />
            </div>

            <div className="p-4">
              <pre className="text-sm text-gray-200">
                <span className="font-mono">{`curl https://optcg-api.ryanmichaelhirst.us/api/v1/cards/card_1234`}</span>
              </pre>
            </div>
          </div>
        </div>

        {/* Path Parameters Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Path Parameters</h3>

          <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
              <span className="text-sm text-gray-400">Parameters</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-medium text-gray-400">Parameter</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">Required</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-3 font-mono text-white">id</td>
                    <td className="px-4 py-3 text-gray-300">string</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        yes
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-300">Unique identifier of the card</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Example Response Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Example Response</h2>

        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
            <span className="text-sm text-gray-400">JSON</span>
            <CopyButton
              text={`{
  "id": "card_1234",
  "code": "OP01-001",
  "rarity": "SEC",
  "type": "Character",
  "name": "Monkey D. Luffy",
  "cost": 4,
  "attribute": "Straw Hat",
  "power": 5000,
  "counter": 1000,
  "color": "red",
  "class": "Leader",
  "effect": "When this card attacks, you may draw 1 card.",
  "set": "Romance Dawn",
  "image": "https://example.com/card_image.jpg"
}`}
              className="p-1 text-gray-400 hover:text-white"
            />
          </div>

          <div className="p-4">
            <pre className="overflow-x-auto text-sm text-gray-200">
              <span className="font-mono">{`{
  "id": "card_1234",
  "code": "OP01-001",
  "rarity": "SEC",
  "type": "Character",
  "name": "Monkey D. Luffy",
  "cost": 4,
  "attribute": "Straw Hat",
  "power": 5000,
  "counter": 1000,
  "color": "red",
  "class": "Leader",
  "effect": "When this card attacks, you may draw 1 card.",
  "set": "Romance Dawn",
  "image": "https://example.com/card_image.jpg"
}`}</span>
            </pre>
          </div>
        </div>
      </section>

      {/* Card Properties Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Card Properties</h2>

        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
            <span className="text-sm text-gray-400">Response Schema</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-gray-400">Property</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">id</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">
                    Unique identifier from database, e.g. card_1234
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">code</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">Serial number on card, e.g. OP01-001</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">rarity</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">
                    Card rarity, e.g. {RARITIES.join(" | ")}
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">type</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">
                    Card type, e.g. {CARD_TYPES.join(" | ")}
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">name</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">Card name, e.g. Monkey D. Luffy</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">cost</td>
                  <td className="px-4 py-3 text-gray-300">number</td>
                  <td className="px-4 py-3 text-gray-300">Card cost, e.g. {COSTS.join(" | ")}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">attribute</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">
                    Card attribute, e.g. {ATTRIBUTES.join(" | ")}
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">power</td>
                  <td className="px-4 py-3 text-gray-300">number</td>
                  <td className="px-4 py-3 text-gray-300">
                    Attack power, e.g. {POWERS.join(" | ")}
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">counter</td>
                  <td className="px-4 py-3 text-gray-300">number</td>
                  <td className="px-4 py-3 text-gray-300">
                    Counter value, e.g. {COUNTERS.join(" | ")}
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">color</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">Card color, e.g. {COLORS.join(" | ")}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">class</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">
                    Card class, e.g. {CARD_CLASSES.slice(0, 2).join(" | ")} | ...
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">effect</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">Card effect description</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">set</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">
                    Set name, e.g. {CARD_SETS.slice(0, 2).join(" | ")} | ...
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="px-4 py-3 font-mono text-white">image</td>
                  <td className="px-4 py-3 text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-300">Card image URL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
