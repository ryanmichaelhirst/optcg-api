export function Properties({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(var(--container-lg)-(--spacing(8)))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({
  name,
  children,
  type,
}: {
  name: string
  children: React.ReactNode
  type?: string
}) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        {type && (
          <>
            <dt className="sr-only">Type</dt>
            <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{type}</dd>
          </>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

export function ApiHeading(props: { type: string; path: string }) {
  return (
    <div className="flex items-center gap-x-3">
      <span className="rounded-lg bg-emerald-400/10 px-1.5 font-mono text-[0.625rem]/6 font-semibold text-emerald-500 ring-1 ring-inset ring-emerald-300 dark:text-emerald-400 dark:ring-emerald-400/30">
        {props.type}
      </span>
      <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
      <span className="font-mono text-xs text-zinc-400">{props.path}</span>
    </div>
  )
}
