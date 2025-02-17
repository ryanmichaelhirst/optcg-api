import { useCards } from "@/api/v1/hooks/cards"
import Container from "@/components/Container"
import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BASE_OPTIONS, ComboBox } from "@/components/ui/combo-box"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CARD_SETS, CARD_TYPES, COLORS } from "@/lib/onepiece"
import { cn } from "@/utils"
import { SEARCH_PARAM_KEYS } from "@/utils/search-params"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { useSearchParams } from "@remix-run/react"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { Schema } from "effect"
import React from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"

const formSchema = Schema.Struct({
  search: Schema.String,
})
type TFormData = Schema.Schema.Type<typeof formSchema>

export default function Page() {
  const [isOpen, setIsOpen] = React.useState(false)

  const form = useForm<TFormData>({
    resolver: effectTsResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const perPage = Number(searchParams.get("per_page")) || 10
  const search = searchParams.get("search")
  const cardId = searchParams.get("card_id")
  const color = searchParams.get("color") ?? ""
  const cardSet = searchParams.get("card_set") ?? ""
  const cardType = searchParams.get("card_type") ?? ""
  const debouncedSetSearchParams = useDebounceCallback(setSearchParams, 500)

  const cardsList = useCards({
    page,
    perPage,
    color,
    set: cardSet,
    type: cardType,
    search: search || null,
  })

  const cards = cardsList.data?.data ?? []
  const total = cardsList.data?.total ?? 0

  return (
    <Container>
      <div className="my-10">
        <Form {...form}>
          <form
            className="space-y-8"
            onInput={(e) => {
              const form = e.currentTarget
              const search = form.elements.namedItem("search") as HTMLInputElement
              searchParams.set(SEARCH_PARAM_KEYS.SEARCH, search.value)
              searchParams.set(SEARCH_PARAM_KEYS.PAGE, String(1))
              debouncedSetSearchParams(searchParams)
            }}
          >
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Search name, code, effect, etc."
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div>
                    <ComboBox
                      options={BASE_OPTIONS.concat(
                        COLORS.map((c) => ({ label: c, value: c.toLowerCase() })),
                      )}
                      value={color}
                      onChange={(value) => {
                        searchParams.set("color", value)
                        setSearchParams(searchParams)
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div>
                    <ComboBox
                      options={BASE_OPTIONS.concat(
                        CARD_TYPES.map((c) => ({ label: c, value: c.toLowerCase() })),
                      )}
                      value={cardType}
                      onChange={(value) => {
                        searchParams.set("card_type", value)
                        setSearchParams(searchParams)
                      }}
                    />
                  </div>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="self-end">
                    {isOpen ? (
                      <IconChevronUp className="h-4 w-4" />
                    ) : (
                      <IconChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Button size="sm" className="w-[120px] self-end">
                  Search
                </Button>
              </div>
              <CollapsibleContent className="space-y-2">
                <div className="space-y-2">
                  <Label>Card set</Label>
                  <div>
                    <ComboBox
                      options={BASE_OPTIONS.concat(
                        CARD_SETS.map((c) => ({ label: c, value: c.toLowerCase() })),
                      )}
                      value={cardSet}
                      onChange={(value) => {
                        searchParams.set("card_set", value)
                        setSearchParams(searchParams)
                      }}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </Form>
      </div>
      <div className="mb-4 grid grid-cols-5 gap-4">
        {cards.map((card) => (
          <HoverCard key={card.id}>
            <HoverCardTrigger asChild>
              <img
                key={card.id}
                src={card.image}
                className={cn("cursor-pointer rounded", card.id === cardId && "drop-shadow-xl")}
                onClick={() => {
                  searchParams.set(SEARCH_PARAM_KEYS.CARD_ID, card.id)
                  setSearchParams(searchParams)
                }}
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{card?.name}</h4>
                  <p className="text-sm">{card?.effect ?? "No effect"}</p>
                  <DescriptionList
                    items={[
                      { name: "Code", value: card.code },

                      { name: "Attribute", value: card.attribute },
                      { name: "Class", value: card.class },
                      { name: "Set", value: card.set },
                    ]}
                  />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      <Pagination page={page} perPage={perPage} total={total} />
    </Container>
  )
}

function DescriptionList(props: { items: { name: string; value: React.ReactNode }[] }) {
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
