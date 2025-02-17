import LogoImage from "@/assets/logo.png"
import { cn } from "@/utils"

export function Logo(props: { className?: string }) {
  return <img src={LogoImage} className={cn("h-16 w-16", props.className)} alt="Site logo" />
}
