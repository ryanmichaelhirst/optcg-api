export async function lazyImportAndLog<T>(msg: string, fn: () => Promise<T>): Promise<T> {
  const startTime = performance.now()
  const imported = await fn()
  const endTime = performance.now()
  console.log("lazy_import", { type: msg, time: endTime - startTime })

  return imported
}
