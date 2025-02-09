import { ButtonLink } from "@/components/ButtonLink"
import { type MetaFunction } from "@remix-run/node"
import { route } from "routes-gen"

export const meta: MetaFunction = () => [{ title: "OPTCG Api | Home" }]

export default function Page() {
  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 text-center text-6xl font-semibold">Welcome to OPTCG Api</div>
        </div>
        <div className="flex items-center justify-center space-x-3">
          <ButtonLink
            to={route("/")}
            size="lg"
            variant="default"
            className="rounded-full font-semibold"
          >
            Get Started
          </ButtonLink>
        </div>
      </div>
    </main>
  )
}
