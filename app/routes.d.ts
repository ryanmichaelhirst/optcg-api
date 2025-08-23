declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/cards": Record<string, never>;
    "/docs": Record<string, never>;
    "/docs/auth": Record<string, never>;
    "/docs/cards/id": Record<string, never>;
    "/docs/cards/list": Record<string, never>;
    "/docs/cards/overview": Record<string, never>;
    "/health-check": Record<string, never>;
    "/preferences/theme": Record<string, never>;
    "/swagger": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/cards"]
      | ["/docs"]
      | ["/docs/auth"]
      | ["/docs/cards/id"]
      | ["/docs/cards/list"]
      | ["/docs/cards/overview"]
      | ["/health-check"]
      | ["/preferences/theme"]
      | ["/swagger"]
  >(...args: T): typeof args[0];
}
