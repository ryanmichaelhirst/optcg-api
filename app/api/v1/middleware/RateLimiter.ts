import { HttpApiMiddleware } from "@effect/platform"

export class RateLimiter extends HttpApiMiddleware.Tag<RateLimiter>()("RateLimiter") {}

// Custom rate limit error
// export class RateLimitError extends Error {
//   public status: number
//   public headers: Record<string, string>

//   constructor(
//      message: string,
//      status: number = 429,
//      headers: Record<string, string> = {},
//   ) {
//     super(message)
//     this.name = "RateLimitError"
//     this.status = status
//     this.headers = headers
//   }
// }

// // In-memory store for rate limiting
// const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// // Clean up expired entries every minute
// setInterval(() => {
//   const now = Date.now()
//   for (const [key, value] of rateLimitStore.entries()) {
//     if (now > value.resetTime) {
//       rateLimitStore.delete(key)
//     }
//   }
// }, 60000) // Clean up every minute

// export function rateLimiterMiddleware<T>(handler: (args: T) => Effect.Effect<any, any, any>) {
//   return (args: T) => {
//     return Effect.gen(function* () {
//       try {
//         console.log("Rate limiter: Middleware called")
//         console.log("Rate limiter: NODE_ENV =", process.env.NODE_ENV)

//         // Skip rate limiting in development
//         if (process.env.NODE_ENV === "development") {
//           console.log("Rate limiter: Skipping due to development mode")
//           return yield* handler(args)
//         }

//         // For now, let's just pass through and add basic rate limiting without request details
//         // We'll implement a simpler approach that doesn't rely on request headers
//         console.log("Rate limiter: Processing with simplified rate limiting")

//         // Use a global rate limit for now (not IP-based)
//         const key = "rate_limit:global"
//         const now = Date.now()
//         const windowMs = 60000 // 1 minute
//         const maxRequests = 100

//         const current = rateLimitStore.get(key)

//         if (!current || now > current.resetTime) {
//           // First request or window expired
//           rateLimitStore.set(key, {
//             count: 1,
//             resetTime: now + windowMs,
//           })
//           console.log(`Rate limiter: New window, count: 1`)
//         } else {
//           // Increment count
//           current.count++
//           console.log(`Rate limiter: Incrementing count, count: ${current.count}`)

//           // Check if rate limit exceeded
//           if (current.count >= maxRequests) {
//             console.log(`Rate limiter: Rate limit exceeded - returning 429`)
//             // Return 429 response when rate limit is exceeded
//             const errorResponse = new Response(
//               JSON.stringify({
//                 error: "Rate limit exceeded",
//                 message: "Maximum 100 requests per minute.",
//                 retryAfter: Math.ceil((current.resetTime - now) / 1000),
//               }),
//               {
//                 status: 429,
//                 statusText: "Too Many Requests",
//                 headers: {
//                   "Content-Type": "application/json",
//                   "X-RateLimit-Limit": maxRequests.toString(),
//                   "X-RateLimit-Remaining": "0",
//                   "X-RateLimit-Reset": current.resetTime.toString(),
//                   "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
//                 },
//               },
//             )
//             return errorResponse
//           }
//         }

//         // Process the request normally
//         const response = yield* handler(args)

//         // Add rate limit headers to successful responses
//         if (response instanceof Response) {
//           const headers = new Headers(response.headers)
//           headers.set("X-RateLimit-Limit", maxRequests.toString())
//           headers.set("X-RateLimit-Remaining", (maxRequests - (current?.count || 1)).toString())
//           headers.set("X-RateLimit-Reset", (current?.resetTime || now + windowMs).toString())

//           return new Response(response.body, {
//             status: response.status,
//             statusText: response.statusText,
//             headers,
//           })
//         }

//         return response
//       } catch (error) {
//         // If there's any error in the rate limiter, just pass through to the handler
//         console.error("Rate limiter error:", error)
//         return yield* handler(args)
//       }
//     })
//   }
// }
