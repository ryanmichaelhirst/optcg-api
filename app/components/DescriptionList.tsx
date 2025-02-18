export function DescriptionList(props: { items: { name: string; value: React.ReactNode }[] }) {
  return (
    <div>
      <dl>
        {props.items.map((item, i) => {
          return (
            <div key={i} className="flex items-center gap-x-2 py-2 sm:px-0">
              <dt className="w-20 flex-none whitespace-break-spaces break-words text-sm font-normal leading-6 text-muted-foreground">
                {item.name}
              </dt>
              <dd
                className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0"
                data-testid={item.name.replace(/\s/g, "-").toLowerCase()}
              >
                {item.value}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
