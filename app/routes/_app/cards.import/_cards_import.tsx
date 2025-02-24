import { useCards } from "@/api/v1/hooks/cards"
import { Card } from "@/api/v1/resources/cards/Card"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Textarea } from "@/components/ui/text-area"
import React from "react"
import { DECKS } from "./deck-lists"
type CardWithCount = Card & { count: number }

import { DescriptionList } from "@/components/DescriptionList"
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
    <Container>
      <div className="my-10 space-y-4">
        <Textarea name="card_list" rows={4} defaultValue={DECKS.BY_LUFFY.toString()} />
        <Button onClick={onImport}>Import</Button>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2 grid gap-y-2">
          {cardsWithCount.map((card) => (
            <HoverCard key={card.id}>
              <HoverCardTrigger asChild>
                <div className="flex cursor-pointer items-center justify-between rounded rounded-l-full border">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 text-foreground">
                    {card.count}
                  </div>
                  <span className="pl-2">{card.name}</span>
                  <p className="bg-muted px-3 py-1">{card.count}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                align="start"
                className="w-[unset] max-w-sm md:max-w-xl"
              >
                <div className="flex space-x-4">
                  <img src={card.image} className={"h-1/3 w-1/3 rounded object-contain"} />
                  <div className="w-72 space-y-1">
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
        <div className="h-full rounded border">Card search here</div>
      </div>
    </Container>
  )
}
