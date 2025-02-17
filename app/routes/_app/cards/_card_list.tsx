import { useCards } from "@/api/v1/hooks/cards"
import { Card } from "@/api/v1/resources/cards/Card"
import Container from "@/components/Container"
import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BASE_OPTIONS, ComboBox, ComboBoxProps } from "@/components/ui/combo-box"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  CARD_CLASSES,
  CARD_SETS,
  CARD_TYPES,
  COLORS,
  COSTS,
  COUNTERS,
  POWERS,
  RARITIES,
} from "@/lib/onepiece"
import { cn } from "@/utils"
import { SEARCH_PARAM_KEYS } from "@/utils/search-params"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { useSearchParams } from "@remix-run/react"
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react"
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
  const page = Number(searchParams.get(SEARCH_PARAM_KEYS.PAGE)) || 1
  const perPage = Number(searchParams.get(SEARCH_PARAM_KEYS.PER_PAGE)) || 10
  const search = searchParams.get(SEARCH_PARAM_KEYS.SEARCH)
  const cardId = searchParams.get(SEARCH_PARAM_KEYS.ID)
  const color = searchParams.get(SEARCH_PARAM_KEYS.COLOR) ?? "all"
  const cardSet = searchParams.get(SEARCH_PARAM_KEYS.SET) ?? "all"
  const cardType = searchParams.get(SEARCH_PARAM_KEYS.TYPE) ?? "all"
  const cardCost = searchParams.get(SEARCH_PARAM_KEYS.COST) ?? "all"
  const cardClass = searchParams.get(SEARCH_PARAM_KEYS.CLASS) ?? "all"
  const cardCounter = searchParams.get(SEARCH_PARAM_KEYS.COUNTER) ?? "all"
  const cardPower = searchParams.get(SEARCH_PARAM_KEYS.POWER) ?? "all"
  const cardRarity = searchParams.get(SEARCH_PARAM_KEYS.RARITY) ?? "all"
  const debouncedSetSearchParams = useDebounceCallback(setSearchParams, 500)

  const cardsList = useCards({
    page,
    perPage,
    color,
    set: cardSet,
    type: cardType,
    cost: cardCost,
    class: cardClass,
    counter: cardCounter,
    power: cardPower,
    rarity: cardRarity,
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
              const search = form.elements.namedItem(SEARCH_PARAM_KEYS.SEARCH) as HTMLInputElement
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
                <Filter
                  label="Color"
                  options={BASE_OPTIONS.concat(
                    COLORS.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={color}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.COLOR, value)
                    setSearchParams(searchParams)
                  }}
                  classes={{
                    button: "w-[120px]",
                  }}
                />
                <Filter
                  label="Type"
                  options={BASE_OPTIONS.concat(
                    CARD_TYPES.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardType}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.TYPE, value)
                    setSearchParams(searchParams)
                  }}
                  classes={{
                    button: "w-[160px]",
                  }}
                />
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
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-x-2 self-end"
                  onClick={() => {
                    // searchParams.delete(SEARCH_PARAM_KEYS.SEARCH)
                    // searchParams.delete(SEARCH_PARAM_KEYS.COLOR)
                    // searchParams.delete(SEARCH_PARAM_KEYS.TYPE)
                    // searchParams.delete(SEARCH_PARAM_KEYS.COUNTER)
                    // searchParams.delete(SEARCH_PARAM_KEYS.COST)
                    // searchParams.delete(SEARCH_PARAM_KEYS.CLASS)
                    // searchParams.delete(SEARCH_PARAM_KEYS.POWER)
                    // searchParams.delete(SEARCH_PARAM_KEYS.RARITY)
                    // searchParams.delete(SEARCH_PARAM_KEYS.SET)
                    // searchParams.delete(SEARCH_PARAM_KEYS.ID)
                    setSearchParams({})
                  }}
                >
                  <IconX className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-4">
                <Filter
                  label="Cost"
                  options={BASE_OPTIONS.concat(
                    COSTS.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardCost}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.COST, value)
                    setSearchParams(searchParams)
                  }}
                  classes={{
                    button: "w-[100px]",
                  }}
                />
                <Filter
                  label="Power"
                  options={BASE_OPTIONS.concat(
                    POWERS.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardPower}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.POWER, value)
                    setSearchParams(searchParams)
                  }}
                  classes={{
                    button: "w-[100px]",
                  }}
                />
                <Filter
                  label="Counter"
                  options={BASE_OPTIONS.concat(
                    COUNTERS.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardCounter}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.COUNTER, value)
                    setSearchParams(searchParams)
                  }}
                  classes={{
                    button: "w-[100px]",
                  }}
                />
                <Filter
                  label="Class"
                  options={BASE_OPTIONS.concat(
                    CARD_CLASSES.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardClass}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.CLASS, value)
                    setSearchParams(searchParams)
                  }}
                />
                <Filter
                  label="Card set"
                  options={BASE_OPTIONS.concat(
                    CARD_SETS.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardSet}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.SET, value)
                    setSearchParams(searchParams)
                  }}
                />
                <Filter
                  label="Rarity"
                  options={BASE_OPTIONS.concat(
                    RARITIES.map((c) => ({ label: c, value: c.toLowerCase() })),
                  )}
                  value={cardRarity}
                  onChange={(value) => {
                    searchParams.set(SEARCH_PARAM_KEYS.RARITY, value)
                    setSearchParams(searchParams)
                  }}
                  classes={{
                    button: "w-[80px]",
                  }}
                />
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
                  searchParams.set(SEARCH_PARAM_KEYS.ID, card.id)
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
      <CardSheet
        card={cards.find((card) => card.id === cardId)}
        onOpenChange={(open) => {
          searchParams.delete(SEARCH_PARAM_KEYS.ID)
          setSearchParams(searchParams)
        }}
      />
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

function Filter(props: {
  label: string
  value: string
  options: ComboBoxProps["options"]
  onChange: ComboBoxProps["onChange"]
  classes?: ComboBoxProps["classes"]
}) {
  return (
    <div className="space-y-2">
      <Label>{props.label}</Label>
      <div>
        <ComboBox
          options={props.options}
          value={props.value}
          onChange={props.onChange}
          classes={props.classes}
        />
      </div>
    </div>
  )
}

function CardSheet(props: { card?: Card; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={!!props.card} onOpenChange={props.onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{props.card?.name}</SheetTitle>
        </SheetHeader>
        <img src={props.card?.image} className="my-2" />
        <p>{props.card?.effect}</p>
        <DescriptionList
          items={[
            { name: "Code", value: props.card?.code },

            { name: "Attribute", value: props.card?.attribute },
            { name: "Class", value: props.card?.class },
            { name: "Set", value: props.card?.set },
          ]}
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button>Add to deck</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
