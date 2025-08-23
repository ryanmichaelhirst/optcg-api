import landingBg from "@/assets/landing_bg.png"
import { ButtonLink } from "@/components/ButtonLink"
import { SITE_NAME } from "@/lib/onepiece"
import { type MetaFunction } from "@remix-run/node"
import { route } from "routes-gen"
import { Footer } from "../Footer"

export const meta: MetaFunction = () => [{ title: `${SITE_NAME} | TCG Player Tools` }]

export default function Page() {
  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${landingBg})` }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 dark:bg-black dark:bg-opacity-70"></div>
      </div>

      <main className="relative h-screen w-full">
        <div className="relative flex h-full flex-col items-center justify-center">
          <p className="mb-10 text-4xl font-bold text-white">{SITE_NAME}</p>
          <div className="flex max-w-xl flex-col items-center">
            <p className="mb-4 text-xl text-white">
              Access all One Piece trading cards from the web or api. Open source. Perfect for deck
              building and personal projects.
            </p>
            <div className="flex items-center justify-center gap-x-4">
              <ButtonLink to={route("/cards")} variant="default">
                Cards
              </ButtonLink>
              <ButtonLink to={route("/docs")} variant="outline">
                API
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
