import { lazyImportAndLog } from "@/utils/lazy-import"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"

const importApiV1 = () =>
  lazyImportAndLog("public_api_v1", () => import("@/api/v1/ApiV1Handler.server"))

export const loader = async (args: LoaderFunctionArgs) => {
  const { handler } = await importApiV1()

  return handler(args.request)
}

export const action = async (args: ActionFunctionArgs) => {
  const { handler } = await importApiV1()

  return handler(args.request)
}
