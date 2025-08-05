import { Effect } from "effect";

// Custom rate limit error
export class RateLimitError extends Error {
  constructor(
    message: string,
    public status: number = 429,
    public headers: Record<string, string> = {}
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function rateLimiterMiddleware<T extends { request: Request }>(
  handler: (args: T) => Effect.Effect<any, any, any>
) {
  return (args: T) => {
    return Effect.gen(function* () {
      // Skip rate limiting in development
      if (process.env.NODE_ENV === "development") {
        return yield* handler(args);
      }

      // Get client IP
      const forwardedFor = args.request.headers.get("x-forwarded-for");
      const realIp = args.request.headers.get("x-real-ip");
      const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown";

      // Get origin
      const origin = args.request.headers.get("origin") || args.request.headers.get("referer") || "unknown";

      // Skip rate limiting for requests from the same domain
      if (origin.includes("optcg-api.ryanmichaelhirst.us") || origin.includes("localhost")) {
        return yield* handler(args);
      }

      const key = `rate_limit:${clientIp}`;
      const now = Date.now();
      const windowMs = 60000; // 1 minute
      const maxRequests = 100;

      const current = rateLimitStore.get(key);
      
      if (!current || now > current.resetTime) {
        // First request or window expired
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs
        });
      } else if (current.count >= maxRequests) {
        // Rate limit exceeded
        return yield* Effect.fail(
          new RateLimitError(
            "Rate limit exceeded. Maximum 100 requests per minute.",
            429,
            {
              "X-RateLimit-Limit": maxRequests.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": current.resetTime.toString(),
              "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString()
            }
          )
        );
      } else {
        // Increment count
        current.count++;
      }

      // Add rate limit headers to response
      const response = yield* handler(args);
      
      if (response instanceof Response) {
        const headers = new Headers(response.headers);
        headers.set("X-RateLimit-Limit", maxRequests.toString());
        headers.set("X-RateLimit-Remaining", (maxRequests - (current?.count || 1)).toString());
        headers.set("X-RateLimit-Reset", (current?.resetTime || (now + windowMs)).toString());
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      }

      return response;
    });
  };
} 