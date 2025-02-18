import { Card } from "@/api/v1/resources/cards/Card"
import { DescriptionList } from "@/components/DescriptionList"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/utils"
import { SEARCH_PARAM_KEYS } from "@/utils/search-params"
import { useSearchParams } from "@remix-run/react"

export function CardPreview({ card, cardId }: { card: Card; cardId?: string | null }) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
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
  )
}
