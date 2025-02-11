"use client"

import { motion } from "framer-motion"

import { ButtonLink } from "@/components/ButtonLink"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
  }>
}
function TopLevelNavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li className="md:hidden">
      <ButtonLink
        to={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </ButtonLink>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: {
  href: string
  children: React.ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
}) {
  return (
    <ButtonLink
      to={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex justify-between gap-2 py-1 pr-3 text-sm transition",
        isAnchorLink ? "pl-7" : "pl-4",
        active
          ? "text-zinc-900 dark:text-white"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
      )}
    >
      <span className="truncate">{children}</span>
      {tag && <Badge>{tag}</Badge>}
    </ButtonLink>
  )
}

function NavigationGroup({ group, className }: { group: NavGroup; className?: string }) {
  return (
    <li className={cn("relative mt-6", className)}>
      <motion.h2 layout="position" className="text-xs font-semibold text-zinc-900 dark:text-white">
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href}>{link.title}</NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

const navigation: Array<NavGroup> = [
  {
    title: "Guides",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Resources",
    links: [{ title: "Cards", href: "/docs/cards" }],
  },
]

export function Navigation(props: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? "md:mt-0" : ""}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <ButtonLink to={"/docs"} className="w-full">
            Sign in
          </ButtonLink>
        </li>
      </ul>
    </nav>
  )
}
