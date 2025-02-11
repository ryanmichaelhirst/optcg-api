import landingBg from "@/assets/landing_bg.png"
import { ButtonLink } from "@/components/ButtonLink"
import { Button } from "@/components/ui/button"
import { type MetaFunction } from "@remix-run/node"
import { route } from "routes-gen"

export const meta: MetaFunction = () => [{ title: "OPTCG Api | Home" }]

export default function Page() {
  return (
    <main className="relative h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${landingBg})` }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 dark:bg-black dark:bg-opacity-70"></div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <p className="mb-10 text-4xl font-bold text-white">OPTCG Api</p>
        <div className="flex max-w-xl flex-col items-center">
          <p className="mb-4 text-xl text-white">
            Access all One Piece trading cards from the web or api. Open source. Perfect for deck
            building and personal projects.
          </p>
          <div className="flex items-center justify-center gap-x-4">
            <ButtonLink to={route("/cards")} variant="outline">
              WEB
            </ButtonLink>
            <ButtonLink to={route("/docs")} variant="default">
              API
            </ButtonLink>
          </div>
          <div className="mt-10">
            <Button
              onClick={() => window.open("https://github.com/ryanmichaelhirst/optcg-api", "_blank")}
              variant="link"
            >
              Github
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
