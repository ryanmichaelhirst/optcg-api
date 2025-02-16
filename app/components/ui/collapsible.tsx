"use client"

import { cn } from "@/utils"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = ({
  children,
  ...props
}: CollapsiblePrimitive.CollapsibleContentProps) => (
  <CollapsiblePrimitive.CollapsibleContent
    {...props}
    className={cn("CollapsibleContent", props.className)}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
)

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
