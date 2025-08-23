import { Badge } from "@/components/ui/badge"

export default function AuthPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-white">Authentication</h1>
        <p className="text-lg text-gray-300">
          Learn how to authenticate with the One Piece TCG API.
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-600 text-white">
            No Auth Required
          </Badge>
          <span className="text-sm text-gray-400">Public API</span>
        </div>

        <h2 className="mb-3 text-xl font-semibold text-white">Current Status</h2>
        <p className="mb-4 text-gray-300">
          The One Piece TCG API is currently a public API that doesn't require authentication. You
          can start making requests immediately without any API keys or tokens.
        </p>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="font-mono text-sm text-gray-200">GET /api/v1/cards</p>
          <p className="mt-1 text-xs text-gray-400">
            No headers required - just start making requests!
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-700/50 bg-blue-900/20 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">Coming Soon</h2>
        <p className="mb-4 text-gray-300">The following features are planned for the future:</p>
        <ul className="mb-4 space-y-2 text-gray-300">
          <li>• API key management</li>
          <li>• Rate limiting per user</li>
        </ul>
        <p className="text-sm text-gray-400">
          For now, enjoy unlimited access to this One Piece TCG database!
        </p>
      </div>
    </div>
  )
}
