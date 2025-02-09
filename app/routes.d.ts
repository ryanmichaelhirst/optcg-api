declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/cards": Record<string, never>;
    "/health-check": Record<string, never>;
    "/preferences/theme": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/cards"]
      | ["/health-check"]
      | ["/preferences/theme"]
  >(...args: T): typeof args[0];
}
