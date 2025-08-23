import { ButtonLink } from "@/components/ButtonLink"
import { CopyButton } from "@/components/CopyButton"
import { route } from "routes-gen"

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <h1 className="text-5xl font-bold text-white">
          Quickstart
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
          Currently only GET requests are supported to retrieve card data.
        </p>
      </section>

      {/* Base URL Section */}
      <section className="space-y-6">
        <h2 className="text-xl text-white">Base URL</h2>
        <div className="space-y-4">          
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-400">API Endpoint</span>
              <CopyButton 
                text="https://optcg-api.ryanmichaelhirst.us/api/v1"
                className="text-gray-400 hover:text-white p-1"
              />
            </div>

            <div className="p-4">
              <pre className="text-sm text-gray-200">
                <span className="font-mono">{`https://optcg-api.ryanmichaelhirst.us/api/v1`}</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl text-white">Sample Request</h2>
        <div className="space-y-4">          
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-400">cURL</span>
              <CopyButton 
                text="curl -G https://optcg-api.ryanmichaelhirst.us/api/v1/cards -d page=1"
                className="text-gray-400 hover:text-white p-1"
              />
            </div>

            <div className="p-4">
              <pre className="text-sm text-gray-200">
                <span className="font-mono">{`curl -G https://optcg-api.ryanmichaelhirst.us/api/v1/cards -d page=1`}</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-white">What's Next?</h2>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-400">Resources</span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mt-0 mb-2 text-lg font-medium text-white">Explore the API</h3>
                  <p className="text-gray-300">Check out the available card endpoints</p>
                </div>
                <ButtonLink to={route("/docs/cards")} variant="default" className="shrink-0">
                  View Resources
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
