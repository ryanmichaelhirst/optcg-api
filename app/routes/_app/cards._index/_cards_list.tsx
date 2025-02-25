import { CardSearch } from "@/components/CardSearch"
import Container from "@/components/Container"

export default function Page() {
  return (
    <Container>
      <CardSearch classes={{ wrapper: "mt-5" }} />
    </Container>
  )
}
