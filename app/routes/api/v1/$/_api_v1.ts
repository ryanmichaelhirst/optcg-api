import { lazyImportAndLog } from "@/utils/lazy-import"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"

const importApiV1 = () =>
  lazyImportAndLog("public_api_v1", () => import("@/api/v1/ApiV1Handler.server"))

export const loader = async (args: LoaderFunctionArgs) => {
  console.log("hit loader")
  const { handler } = await importApiV1()
  console.log("import loader")

  return handler(args.request)
}

export const action = async (args: ActionFunctionArgs) => {
  console.log("hit action")
  const { handler } = await importApiV1()
  console.log("import action")

  return handler(args.request)
}
