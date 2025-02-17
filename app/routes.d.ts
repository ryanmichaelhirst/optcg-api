declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/cards": Record<string, never>;
    "/docs": Record<string, never>;
    "/docs/cards": Record<string, never>;
    "/health-check": Record<string, never>;
    "/preferences/theme": Record<string, never>;
    "/swagger": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/cards"]
      | ["/docs"]
      | ["/docs/cards"]
      | ["/health-check"]
      | ["/preferences/theme"]
      | ["/swagger"]
  >(...args: T): typeof args[0];
}
