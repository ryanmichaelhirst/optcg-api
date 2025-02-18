import { useCards } from "@/api/v1/hooks/cards"
import { CardPreview } from "@/components/CardPreview"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/text-area"
import React from "react"

export default function Page() {
  const [codes, setCodes] = React.useState<string[]>([])
  const cardsList = useCards({
    cardIds: codes,
    perPage: 51,
  })
  const cards = cardsList.data?.data ?? []

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const cardList = form.elements.namedItem("card_list") as HTMLInputElement
          const value = cardList.value

          setCodes(value.split(",").map((code) => code.trim()))
        }}
        className="mb-10 space-y-4"
      >
        <p>Card list</p>
        <Textarea name="card_list" rows={4} defaultValue={list.toString()} />
        <Button type="submit">Import</Button>
      </form>
      {codes.length === 0 ? (
        <p>Waiting for import...</p>
      ) : (
        <div className="mb-4 grid grid-cols-5 gap-4">
          {codes.map((code, idx) => {
            const card = cards.find((card) => card.code === code)
            if (!card) {
              return <p key={idx}>Error finding card</p>
            }

            return <CardPreview key={idx} card={card} />
          })}
        </div>
      )}
    </Container>
  )
}

// Blue Doffy Deck
// https://onepiecetopdecks.com/deck-list/japan-op-09-the-new-emperor-decks/deckgen/?dn=Blue%20Doffy&date=12/1/2024&cn=JP&au=Tappy&pl=1st%20Place&tn=Aichi%20Area(12-1)&hs=Bandai&dg=1nOP01-060a4nST03-005a3nST03-004a4nOP01-077a1nOP03-044a3nOP06-047a4nEB01-023a4nOP07-040a4nOP07-045a4nOP07-046a4nST17-002a2nST17-003a4nST17-004a4nST17-005a1nOP02-068a2nOP06-058a2nOP07-057&cs=223
const list = [
  "OP01-060",
  "ST03-005",
  "ST03-005",
  "ST03-005",
  "ST03-005",
  "ST03-004",
  "ST03-004",
  "ST03-004",
  "OP01-077",
  "OP01-077",
  "OP01-077",
  "OP01-077",
  "OP03-044",
  "OP06-047",
  "OP06-047",
  "OP06-047",
  "EB01-023",
  "EB01-023",
  "EB01-023",
  "EB01-023",
  "OP07-040",
  "OP07-040",
  "OP07-040",
  "OP07-040",
  "OP07-045",
  "OP07-045",
  "OP07-045",
  "OP07-045",
  "OP07-046",
  "OP07-046",
  "OP07-046",
  "OP07-046",
  "ST17-002",
  "ST17-002",
  "ST17-002",
  "ST17-002",
  "ST17-003",
  "ST17-003",
  "ST17-004",
  "ST17-004",
  "ST17-004",
  "ST17-004",
  "ST17-005",
  "ST17-005",
  "ST17-005",
  "ST17-005",
  "OP02-068",
  "OP06-058",
  "OP06-058",
  "OP07-057",
  "OP07-057",
]
