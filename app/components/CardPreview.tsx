import { Card } from "@/api/v1/resources/cards/Card"
import { DescriptionList } from "@/components/DescriptionList"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function CardPreview({
  card,
  children,
  preview,
}: {
  card: Card
  children: React.ReactNode
  preview?: boolean
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-[unset] max-w-sm md:max-w-xl">
        <div className="flex items-center space-x-4">
          {preview && <img src={card.image} className={"h-1/3 w-1/3 rounded object-contain"} />}
          <div className="w-72">
            <h4 className="my-0 text-sm font-semibold">{card?.name}</h4>
            <p className="text-sm">{card?.effect ?? "No effect"}</p>
            <DescriptionList
              classes={{ wrapper: "mt-4" }}
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
