import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import "@dotenvx/dotenvx/config"
import { Config, Effect } from "effect"
import { existsSync } from "fs"
import fs from "fs/promises"
import path from "path"
import util from "util"

const program = Effect.gen(function* () {
  const BUCKET_NAME = yield* Config.string("CF_BUCKET")
  const ACCOUNT_ID = yield* Config.string("CF_ACCOUNT_ID")
  const ACCESS_KEY_ID = yield* Config.string("S3_ACCESS_KEY_ID")
  const SECRET_ACCESS_KEY = yield* Config.string("S3_SECRET_ACCESS_KEY")
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  })

  // Load images
  const imgDir = path.join(process.cwd(), "tmp", "images")
  if (!existsSync(imgDir)) {
    throw new Error("Img directoy does not exist. Did you scrape the images?")
  }
  const filenames = yield* Effect.promise(() => fs.readdir(imgDir))

  // Upload images
  const effects = filenames.map((filename) =>
    Effect.gen(function* () {
      const file = yield* Effect.promise(() => fs.readFile(path.join(imgDir, filename)))

      yield* Effect.tryPromise({
        try: () => S3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: filename })),
        catch: (error) => error,
      }).pipe(
        Effect.matchEffect({
          onFailure: () =>
            Effect.gen(function* () {
              console.log(`🔄 Uploading ${filename}`)
              yield* Effect.promise(() =>
                S3.send(
                  new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: filename,
                    Body: file,
                  }),
                ),
              )
              console.log(`✅ Uploaded ${filename}`)
            }),
          onSuccess: () => Effect.succeed(console.log(`✅ Already uploaded ${filename}`)),
        }),
      )
    }),
  )
  yield* Effect.all(effects, {
    concurrency: "unbounded",
  })
})

Effect.runPromiseExit(program).then((exit) => {
  console.log(util.inspect(exit, { depth: Infinity, colors: true }))
})
