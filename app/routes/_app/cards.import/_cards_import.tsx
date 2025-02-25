import { useCards } from "@/api/v1/hooks/cards"
import { Card } from "@/api/v1/resources/cards/Card"
import { CardPreview } from "@/components/CardPreview"
import { CardSearch } from "@/components/CardSearch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/text-area"
import React from "react"
import { DECKS } from "./deck-lists"

type CardWithCount = Card & { count: number }

export default function Page() {
  const [codes, setCodes] = React.useState<string[]>([])
  const cardsList = useCards({
    cardIds: codes,
    perPage: 100,
  })

  const onImport = () => {
    const codes = (document.querySelector("textarea[name=card_list]") as HTMLTextAreaElement)?.value
    setCodes(codes.trim().split(","))
  }

  const cardsWithCount = codes.sort().reduce<CardWithCount[]>((acc, cur) => {
    const arrIdx = acc.findIndex((card) => card.code === cur)
    const card = cardsList.data?.data.find((card) => card.code === cur)
    if (!card) return acc

    if (arrIdx === -1) {
      acc.push({ ...card, count: 1 })
    } else {
      acc[arrIdx].count += 1
    }

    return acc
  }, [])

  return (
    <div className="mx-12">
      <div className="my-5 text-right">
        <ImportSheet onImport={onImport} />
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1 space-y-2">
          {cardsWithCount.length === 0 &&
            Array.from(Array(20).keys()).map((num) => (
              <Skeleton key={num} className="h-6 w-full rounded-full " />
            ))}
          {cardsWithCount.map((card) => (
            <CardPreview key={card.id} card={card} preview>
              <div className="flex cursor-pointer items-center justify-between rounded rounded-l-full border-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white">
                  {card.count}
                </div>
                <span className="px-2 font-medium">{card.code}</span>
                <span className="flex-1 truncate">{card.name}</span>
                <p className="bg-muted px-3 py-1">{card.count}</p>
              </div>
            </CardPreview>
          ))}
        </div>
        <div className="col-span-5 h-full rounded border p-4">
          <CardSearch />
        </div>
      </div>
    </div>
  )
}

function ImportSheet(props: { onImport: () => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Import deck</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Import deck</SheetTitle>
        </SheetHeader>
        <Label>Card list</Label>
        <p className="text-sm text-muted-foreground">
          Comma separated codes e.g. OP01-001, OP02-001
        </p>
        <Textarea name="card_list" rows={20} defaultValue={DECKS.BY_LUFFY.toString()} />

        <SheetFooter className="mt-10">
          <SheetClose asChild>
            <Button onClick={props.onImport}>Import</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
