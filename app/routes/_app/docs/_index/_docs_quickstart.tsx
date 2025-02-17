import { ButtonLink } from "@/components/ButtonLink"
import { route } from "routes-gen"

export default function Page() {
  return (
    <div className="space-y-10">
      <section className="space-y-10">
        <h1 className="text-4xl font-bold">Quickstart</h1>
        <p>
          This API is organized around REST. You can expect predictable resource-oriented URLs,
          JSON-encoded responses, and standard HTTP response codes. Only GET methods are supported
          at this time.
        </p>
        <p>
          Base url:{" "}
          <span className="inline rounded border-primary bg-gray-300 p-1">
            https://optcgapi.ryanmichaelhirst.us
          </span>
        </p>
      </section>

      <section className="space-y-10">
        <h2>Making your first api request</h2>
        <span className="inline rounded border-primary bg-gray-300 p-1">
          curl -G https://optcgapi.ryanmichaelhirst.us/api/v1/cards \ -d page=1
        </span>
        <div>
          <p className="mb-4">For more information about each endpoint, go to the Resources page</p>
          <ButtonLink to={route("/docs/cards")} variant="default">
            Learn more
          </ButtonLink>
        </div>
      </section>

      <section className="text-gray-300">
        <p>Authorization: Coming Soon</p>
      </section>
    </div>
  )
}
