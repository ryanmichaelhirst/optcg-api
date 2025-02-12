import { useCards } from "@/api/v1/hooks/cards"
import Container from "@/components/Container"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/utils"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { useSearchParams } from "@remix-run/react"
import { IconInfoCircle } from "@tabler/icons-react"
import { Schema } from "effect"
import { useForm } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"

const formSchema = Schema.Struct({
  search: Schema.String,
})
type TFormData = Schema.Schema.Type<typeof formSchema>

export default function Page() {
  const form = useForm<TFormData>({
    resolver: effectTsResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const perPage = Number(searchParams.get("per_page")) || 20
  const search = searchParams.get("search")
  const cardId = searchParams.get("card_id")
  const [debouncedSearch] = useDebounceValue(search, 500)

  const cardsList = useCards({
    page,
    perPage,
    search: debouncedSearch || null,
  })

  const cards = cardsList.data?.data ?? []
  const card = cards.find((c) => c.id === cardId)

  return (
    <Container>
      <div className="my-10">
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            onInput={(e) => {
              const form = e.currentTarget
              const search = form.elements.namedItem("search") as HTMLInputElement
              searchParams.set("search", search.value)
              setSearchParams(searchParams)
            }}
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <Input placeholder="Smoker" {...field} />
                  </FormControl>
                  <FormDescription>
                    Search by effect, id, name, attribute, class, effect, or set.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {cards.map((card) => (
          <HoverCard key={card.id}>
            <HoverCardTrigger asChild>
              <img
                key={card.id}
                src={card.image}
                className={cn("cursor-pointer rounded", card.id === cardId && "drop-shadow-xl")}
                onClick={() => {
                  searchParams.set("card_id", card.id)
                  setSearchParams(searchParams)
                }}
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{card?.name}</h4>
                  <p className="text-sm">{card?.effect}</p>
                  <div className="flex items-center pt-2">
                    <IconInfoCircle className="h-6 w-6" />
                    <span className="text-xs text-muted-foreground">{card?.class}</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </Container>
  )
}

// function CardSheet(props: { card: any; open: boolean; onOpenChange: (open: boolean) => void }) {
//   const { card } = props

//   return (
//     <Sheet open={props.open} onOpenChange={props.onOpenChange}>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>{card?.name}</SheetTitle>
//           <SheetDescription>
//             {card?.rarity} | {card?.type}
//           </SheetDescription>
//         </SheetHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="id" className="text-right">
//               ID
//             </Label>
//             <span id="id" className="col-span-3">
//               {card?.id}
//             </span>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="code" className="text-right">
//               Code
//             </Label>
//             <span id="id" className="col-span-3">
//               {card?.code}
//             </span>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name
//             </Label>
//             <span id="name" className="col-span-3">
//               {card?.name}
//             </span>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }
