import { ButtonLink } from "@/components/ButtonLink"

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <h1 className="text-5xl font-bold text-white">Cards API</h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
          Search for any card in the One Piece TCG database. Perfect for building your own card
          search engine.
        </p>
      </section>

      {/* API Endpoints Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-3 text-xl font-semibold text-white">List Cards</h3>
            <p className="mb-4 text-gray-300">
              Retrieve a paginated list of cards with optional filtering and pagination. Perfect for
              building card search interfaces and browsing the database.
            </p>
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-green-400">GET</span>
                <span className="font-mono text-sm text-gray-300">/api/v1/cards</span>
              </div>
              <p className="text-sm text-gray-400">Supports 11+ query parameters for filtering</p>
            </div>
            <ButtonLink to="/docs/cards/list" variant="outline" className="w-full">
              View Details
            </ButtonLink>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h3 className="mb-3 text-xl font-semibold text-white">Get Card by ID</h3>
            <p className="mb-4 text-gray-300">
              Retrieve detailed information about a specific card by its unique identifier. Returns
              complete card data including all properties and metadata.
            </p>
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-green-400">GET</span>
                <span className="font-mono text-sm text-gray-300">/api/v1/cards/{"{id}"}</span>
              </div>
              <p className="text-sm text-gray-400">Returns full card object with all properties</p>
            </div>
            <ButtonLink to="/docs/cards/id" variant="outline" className="w-full">
              View Details
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <h4 className="mb-2 text-lg font-medium text-white">Advanced Filtering</h4>
            <p className="text-sm text-gray-300">
              Filter by color, set, type, cost, power, rarity, and more with powerful query
              parameters.
            </p>
          </div>
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <h4 className="mb-2 text-lg font-medium text-white">Pagination</h4>
            <p className="text-sm text-gray-300">
              Built-in pagination support with customizable page size for efficient data retrieval.
            </p>
          </div>
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <h4 className="mb-2 text-lg font-medium text-white">Search</h4>
            <p className="text-sm text-gray-300">
              Full-text search across card names with instant results and relevance scoring.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
