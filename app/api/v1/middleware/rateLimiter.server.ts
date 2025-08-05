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
      try {
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

        // Log request for debugging
        console.log(`Rate limiter: Request from ${clientIp}, origin: ${origin}`);

        // Skip rate limiting for requests from the same domain
        if (origin.includes("optcg-api.ryanmichaelhirst.us") || origin.includes("localhost")) {
          console.log("Rate limiter: Skipping rate limit for whitelisted domain");
          return yield* handler(args);
        }

        // For now, just pass through to the handler without rate limiting
        // This will help us debug if the rate limiter is causing the 500 error
        console.log("Rate limiter: Processing external request (rate limiting disabled for debugging)");
        return yield* handler(args);

        // TODO: Re-enable rate limiting once we confirm the middleware works
        /*
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
          // Rate limit exceeded - return a proper HTTP response instead of throwing
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
        } else {
          // Increment count
          current.count++;
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
        */
      } catch (error) {
        // If there's any error in the rate limiter, just pass through to the handler
        console.error("Rate limiter error:", error);
        return yield* handler(args);
      }
    });
  };
} 