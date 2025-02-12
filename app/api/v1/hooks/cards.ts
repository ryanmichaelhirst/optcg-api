import { useQuery } from "@tanstack/react-query"
import { Effect } from "effect"

import { ApiV1Client } from "../ApiV1Client"
import { ApiV1Runtime } from "../ApiV1Runtime"

export function useCards(args?: { page?: number; perPage?: number; search?: string | null }) {
  return useQuery({
    queryKey: ["cards", args],
    queryFn: () =>
      Effect.gen(function* () {
        const client = yield* ApiV1Client

        return yield* client.cards.list({
          urlParams: {
            page: args?.page ?? 1,
            per_page: args?.perPage ?? 20,
            ...(args?.search && { search: args.search }),
          },
        })
      }).pipe(ApiV1Runtime.runPromise),
  })
}
