import { z } from "zod"

import { singleton } from "@/utils/singleton.server"

const EnvSchema = z.object({
  APP_ENV: z.union([z.literal("development"), z.literal("production")]).default("development"),
  DATABASE_URL: z.string().min(1),
})

const ENV = singleton("env", () => {
  console.log("⚙️ loading environment variables")

  const parsedEnv = EnvSchema.safeParse(process.env)

  if (!parsedEnv.success) {
    console.error("Error loading environment variables", parsedEnv.error)
    process.exit(1)
  }

  return parsedEnv.data
})

export { ENV }
