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

export function rateLimiterMiddleware<T>(
  handler: (args: T) => Effect.Effect<any, any, any>
) {
  return (args: T) => {
    return Effect.gen(function* () {
      try {
        console.log("Rate limiter: Middleware called");
        console.log("Rate limiter: NODE_ENV =", process.env.NODE_ENV);
        console.log("Rate limiter: args =", args);
        
        // Skip rate limiting in development
        if (process.env.NODE_ENV === "development") {
          console.log("Rate limiter: Skipping due to development mode");
          return yield* handler(args);
        }

        // Try to get request from different possible structures
        let request: Request | undefined;
        let clientIp = "unknown";
        let origin = "unknown";

        // Check if args has a request property
        if (args && typeof args === 'object' && 'request' in args) {
          request = (args as any).request;
        }
        
        // If no request found, try to get it from the Effect.js context
        if (!request) {
          console.log("Rate limiter: No request found in args, trying to get from context");
          // For now, just pass through to avoid errors
          return yield* handler(args);
        }

        // Get client IP
        const forwardedFor = request.headers.get("x-forwarded-for");
        const realIp = request.headers.get("x-real-ip");
        clientIp = forwardedFor?.split(",")[0] || realIp || "unknown";

        // Get origin
        origin = request.headers.get("origin") || request.headers.get("referer") || "unknown";

        // Log request for debugging
        console.log(`Rate limiter: Request from ${clientIp}, origin: ${origin}`);
        console.log(`Rate limiter: All headers:`, Object.fromEntries(request.headers.entries()));

        // Skip rate limiting for requests from the same domain
        if (origin.includes("optcg-api.ryanmichaelhirst.us") || origin.includes("localhost")) {
          console.log("Rate limiter: Skipping rate limit for whitelisted domain");
          return yield* handler(args);
        }

        console.log("Rate limiter: Processing external request with rate limiting");

        // Step 2: Re-enable rate limit blocking
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
          console.log(`Rate limiter: New window for ${clientIp}, count: 1`);
        } else {
          // Increment count
          current.count++;
          console.log(`Rate limiter: Incrementing count for ${clientIp}, count: ${current.count}`);
          
          // Check if rate limit exceeded
          if (current.count >= maxRequests) {
            console.log(`Rate limiter: Rate limit exceeded for ${clientIp} - returning 429`);
            // Return 429 response when rate limit is exceeded
            const errorResponse = new Response(
              JSON.stringify({
                error: "Rate limit exceeded",
                message: "Maximum 100 requests per minute.",
                retryAfter: Math.ceil((current.resetTime - now) / 1000)
              }),
              {
                status: 429,
                statusText: "Too Many Requests",
                headers: {
                  "Content-Type": "application/json",
                  "X-RateLimit-Limit": maxRequests.toString(),
                  "X-RateLimit-Remaining": "0",
                  "X-RateLimit-Reset": current.resetTime.toString(),
                  "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString()
                }
              }
            );
            return errorResponse;
          }
        }

        // Process the request normally
        const response = yield* handler(args);
        
        // Add rate limit headers to successful responses
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
      } catch (error) {
        // If there's any error in the rate limiter, just pass through to the handler
        console.error("Rate limiter error:", error);
        return yield* handler(args);
      }
    });
  };
} 