import { Effect } from "effect"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { RateLimitError } from "../app/api/v1/middleware/rateLimiter.server"

// Mock the rate limiter middleware
const mockRateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Simplified rate limiter for testing
function createTestRateLimiter() {
  return function rateLimiterMiddleware<T extends { request: Request }>(
    handler: (args: T) => Effect.Effect<any, any, any>,
  ) {
    return (args: T) => {
      return Effect.gen(function* () {
        // Skip rate limiting in development
        if (process.env.NODE_ENV === "development") {
          return yield* handler(args)
        }

        // Get client IP
        const forwardedFor = args.request.headers.get("x-forwarded-for")
        const realIp = args.request.headers.get("x-real-ip")
        const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown"

        // Get origin
        const origin =
          args.request.headers.get("origin") || args.request.headers.get("referer") || "unknown"

        // Skip rate limiting for requests from the same domain
        if (origin.includes("optcg-api.ryanmichaelhirst.us") || origin.includes("localhost")) {
          return yield* handler(args)
        }

        const key = `rate_limit:${clientIp}`
        const now = Date.now()
        const windowMs = 60000 // 1 minute
        const maxRequests = 100

        const current = mockRateLimitStore.get(key)

        if (!current || now > current.resetTime) {
          // First request or window expired
          mockRateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
          })
        } else if (current.count >= maxRequests) {
          // Rate limit exceeded
          return yield* Effect.fail(
            new RateLimitError("Rate limit exceeded. Maximum 100 requests per minute.", 429, {
              "X-RateLimit-Limit": maxRequests.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": current.resetTime.toString(),
              "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
            }),
          )
        } else {
          // Increment count
          current.count++
        }

        // Add rate limit headers to response
        const response = yield* handler(args)

        if (response instanceof Response) {
          const headers = new Headers(response.headers)
          headers.set("X-RateLimit-Limit", maxRequests.toString())
          headers.set("X-RateLimit-Remaining", (maxRequests - (current?.count || 1)).toString())
          headers.set("X-RateLimit-Reset", (current?.resetTime || now + windowMs).toString())

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          })
        }

        return response
      })
    }
  }
}

describe("Rate Limiter Middleware", () => {
  beforeEach(() => {
    // Clear the rate limit store before each test
    mockRateLimitStore.clear()
    // Reset environment to production for testing
    process.env.NODE_ENV = "production"
  })

  it("should allow requests in development mode", async () => {
    process.env.NODE_ENV = "development"

    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        origin: "https://external-site.com",
      },
    })

    const result = await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)

    expect(result).toBe("success")
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it("should allow requests from the same domain", async () => {
    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        origin: "https://optcg-api.ryanmichaelhirst.us",
      },
    })

    const result = await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)

    expect(result).toBe("success")
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it("should allow requests from localhost", async () => {
    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        origin: "http://localhost:3000",
      },
    })

    const result = await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)

    expect(result).toBe("success")
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it("should rate limit external requests", async () => {
    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        origin: "https://external-site.com",
      },
    })

    // First request should succeed
    const result1 = await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
    expect(result1).toBe("success")

    // Simulate 100 requests to hit the limit
    for (let i = 0; i < 99; i++) {
      await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
    }

    // 101st request should fail
    try {
      await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
      expect.fail("Should have thrown an error")
    } catch (error: any) {
      // Check if the error message contains our rate limit message
      expect(error.message).toContain("Rate limit exceeded")
      expect(error.message).toContain("Maximum 100 requests per minute")
    }
  })

  it("should track requests by IP address", async () => {
    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest1 = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        origin: "https://external-site.com",
      },
    })

    const mockRequest2 = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.2",
        origin: "https://external-site.com",
      },
    })

    // Both IPs should be able to make requests independently
    const result1 = await Effect.runPromise(wrappedHandler({ request: mockRequest1 }) as any)
    const result2 = await Effect.runPromise(wrappedHandler({ request: mockRequest2 }) as any)

    expect(result1).toBe("success")
    expect(result2).toBe("success")

    // Check that both IPs are tracked separately
    expect(mockRateLimitStore.has("rate_limit:192.168.1.1")).toBe(true)
    expect(mockRateLimitStore.has("rate_limit:192.168.1.2")).toBe(true)
  })

  it("should reset rate limit after window expires", async () => {
    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        origin: "https://external-site.com",
      },
    })

    // Make 100 requests to hit the limit
    for (let i = 0; i < 100; i++) {
      await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
    }

    // 101st request should fail
    try {
      await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
      expect.fail("Should have thrown an error")
    } catch (error: any) {
      // Check if the error message contains our rate limit message
      expect(error.message).toContain("Rate limit exceeded")
    }

    // Manually expire the window by setting reset time to past
    const key = "rate_limit:192.168.1.1"
    const current = mockRateLimitStore.get(key)
    if (current) {
      current.resetTime = Date.now() - 1000 // Set to 1 second ago
    }

    // Next request should succeed again
    const result2 = await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
    expect(result2).toBe("success")
  })

  it("should handle requests without origin header", async () => {
    const mockHandler = vi.fn().mockReturnValue(Effect.succeed("success"))
    const rateLimiter = createTestRateLimiter()
    const wrappedHandler = rateLimiter(mockHandler)

    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        // No origin header
      },
    })

    // Should be rate limited since origin is 'unknown'
    const result = await Effect.runPromise(wrappedHandler({ request: mockRequest }) as any)
    expect(result).toBe("success")

    // Check that it's being tracked
    expect(mockRateLimitStore.has("rate_limit:192.168.1.1")).toBe(true)
  })
})
