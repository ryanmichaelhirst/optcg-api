import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/db.server"
import { app } from "@/utils/app.server"
import { LoaderFunctionArgs } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"

export const loader = async (args: LoaderFunctionArgs) =>
  app(args).build(async (ctx) => {
    const cards = await db.card.findMany({
      take: 100,
    })

    return typedjson({ cards })
  })

export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  return (
    <div>
      <p>Card list</p>
      {data.cards.map((card) => (
        <Card key={card.id}>
          <CardHeader>
            <CardTitle>{card.name}</CardTitle>
            <CardDescription>{card.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={card.image} className="size-4/12 rounded" />
            <div>{card.class}</div>
            <div>{card.effect}</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Copy</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
