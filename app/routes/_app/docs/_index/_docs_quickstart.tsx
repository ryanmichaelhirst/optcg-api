import { ButtonLink } from "@/components/ButtonLink"
import { route } from "routes-gen"

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Quickstart
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Get started with our REST API in minutes. Simple, predictable endpoints with JSON responses.
        </p>
      </section>

      {/* API Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">API Overview</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">REST-based architecture</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">JSON responses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Standard HTTP status codes</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">GET methods only</span>
            </div>
          </div>
        </div>
      </section>

      {/* Base URL */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Base URL</h2>
        <div className="bg-gray-900 rounded-lg p-4">
          <span className="text-gray-400 font-mono text-lg">
            https://optcgapi.ryanmichaelhirst.us
          </span>
        </div>
      </section>

      {/* First Request */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Your First Request</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Try this example to get started:</p>
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Terminal</span>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-gray-400 font-mono text-sm block">
              curl -G https://optcg-api.ryanmichaelhirst.us/api/v1/cards \<br />
              &nbsp;&nbsp;&nbsp;&nbsp;-d page=1
            </span>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">What's Next?</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Explore the API</h3>
              <p className="text-gray-600">Discover all available endpoints and parameters</p>
            </div>
            <ButtonLink to={route("/docs/cards")} variant="default" className="shrink-0">
              View Resources
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-medium text-gray-900">Authentication</h3>
            <p className="text-gray-600 text-sm">Coming soon - enhanced security features</p>
          </div>
        </div>
      </section>
    </div>
  )
}
