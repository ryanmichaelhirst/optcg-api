"use client"

import * as React from "react"

import { ButtonLink } from "@/components/ButtonLink"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/utils"
import { route } from "routes-gen"

export function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <ButtonLink to={route("/")} className="bg-none hover:no-underline" variant="ghost">
              <Logo className="h-6 w-6" />
            </ButtonLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href={route("/")}
                  >
                    <Logo className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">OPTCG API</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      One Piece trading cards from the web or api, completely open source.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href={route("/cards")} title="Web">
                Use the card explorer to start building decks.
              </ListItem>
              <ListItem href={route("/docs")} title="API">
                View the swagger docs to start using the API.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <ButtonLink to={route("/cards")} className="hover:no-underline" variant="ghost">
              Cards
            </ButtonLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Button
              onClick={() => window.open("/swagger", "_blank")}
              className="hover:no-underline"
              variant="ghost"
            >
              Swagger
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Button
              onClick={() => window.open("https://github.com/ryanmichaelhirst/optcg-api", "_blank")}
              className="hover:no-underline"
              variant="ghost"
            >
              Github
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
