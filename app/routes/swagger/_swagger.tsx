import { lazyImportAndLog } from "@/utils/lazy-import"
import { LoaderFunctionArgs } from "@remix-run/node"

const importApiV1 = () =>
  lazyImportAndLog("public_api_v1", () => import("@/api/v1/ApiV1Handler.server"))

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { handler } = await importApiV1()

  return await handler(request)
}
