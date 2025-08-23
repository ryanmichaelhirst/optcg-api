import { Badge } from "@/components/ui/badge"

export default function AuthPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Authentication</h1>
        <p className="text-gray-300 text-lg">
          Learn how to authenticate with the One Piece TCG API.
        </p>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary" className="bg-green-600 text-white">
            No Auth Required
          </Badge>
          <span className="text-gray-400 text-sm">Public API</span>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-3">Current Status</h2>
        <p className="text-gray-300 mb-4">
          The One Piece TCG API is currently a public API that doesn't require authentication. 
          You can start making requests immediately without any API keys or tokens.
        </p>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-200 font-mono text-sm">
            GET /api/v1/cards
          </p>
          <p className="text-gray-400 text-xs mt-1">
            No headers required - just start making requests!
          </p>
        </div>
      </div>

      <div className="p-6 bg-blue-900/20 rounded-lg border border-blue-700/50">
        <h2 className="text-xl font-semibold text-white mb-3">Coming Soon</h2>
        <p className="text-gray-300 mb-4">
          The following features are planned for the future:
        </p>
        <ul className="text-gray-300 space-y-2 mb-4">
          <li>• API key management</li>
          <li>• Rate limiting per user</li>
        </ul>
        <p className="text-gray-400 text-sm">
          For now, enjoy unlimited access to this One Piece TCG database!
        </p>
      </div>
    </div>
  )
}
