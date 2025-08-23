import { ButtonLink } from "@/components/ButtonLink"

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <h1 className="text-5xl font-bold text-white">
          Cards API
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
          Search for any card in the One Piece TCG database. Perfect for building your own card search engine.
        </p>
      </section>

      {/* API Endpoints Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">List Cards</h3>
            <p className="text-gray-300 mb-4">
              Retrieve a paginated list of cards with optional filtering and pagination. 
              Perfect for building card search interfaces and browsing the database.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-mono text-sm">GET</span>
                <span className="text-gray-300 font-mono text-sm">/api/v1/cards</span>
              </div>
              <p className="text-gray-400 text-sm">Supports 11+ query parameters for filtering</p>
            </div>
            <ButtonLink to="/docs/cards/list" variant="outline" className="w-full">
              View Details
            </ButtonLink>
          </div>

          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">Get Card by ID</h3>
            <p className="text-gray-300 mb-4">
              Retrieve detailed information about a specific card by its unique identifier. 
              Returns complete card data including all properties and metadata.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-mono text-sm">GET</span>
                <span className="text-gray-300 font-mono text-sm">/api/v1/cards/{'{id}'}</span>
              </div>
              <p className="text-gray-400 text-sm">Returns full card object with all properties</p>
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
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-2">Advanced Filtering</h4>
            <p className="text-gray-300 text-sm">
              Filter by color, set, type, cost, power, rarity, and more with powerful query parameters.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-2">Pagination</h4>
            <p className="text-gray-300 text-sm">
              Built-in pagination support with customizable page size for efficient data retrieval.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-2">Search</h4>
            <p className="text-gray-300 text-sm">
              Full-text search across card names with instant results and relevance scoring.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
