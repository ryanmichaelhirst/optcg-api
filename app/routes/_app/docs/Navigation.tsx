"use client"

import { useLocation } from "@remix-run/react"
import { motion } from "framer-motion"

import { ButtonLink } from "@/components/ButtonLink"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
    children?: Array<{
      title: string
      href: string
    }>
  }>
}

function NavLink({
  href,
  children,
  tag,
  active = false,
}: {
  href: string
  children: React.ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
  isChild?: boolean
}) {
  return (
    <ButtonLink
      to={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex justify-between gap-2 py-1 pl-0 pr-3 text-sm transition",
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
  const location = useLocation()

  return (
    <li className={cn("relative mt-6", className)}>
      <motion.h2
        layout="position"
        className="text-base font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3">
        <ul>
          {group.links.map((link) => {
            const isActive = location.pathname === link.href
            const hasActiveChild = link.children?.some((child) => location.pathname === child.href)

            return (
              <motion.li key={link.href} layout="position" className="relative">
                <NavLink href={link.href} active={isActive || hasActiveChild}>
                  {link.title}
                </NavLink>

                {/* Render child links if they exist */}
                {link.children && (
                  <ul className="mt-1">
                    {link.children.map((child) => (
                      <motion.li key={child.href} layout="position" className="relative">
                        <NavLink
                          href={child.href}
                          active={location.pathname === child.href}
                          isChild={true}
                        >
                          {child.title}
                        </NavLink>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

const navigation: Array<NavGroup> = [
  {
    title: "Get Started",
    links: [
      { title: "Overview", href: "/docs" },
      { title: "Authentication", href: "/docs/auth" },
    ],
  },
  {
    title: "Cards API",
    links: [
      { title: "Overview", href: "/docs/cards/overview" },
      { title: "List Cards", href: "/docs/cards/list" },
      { title: "Get Card", href: "/docs/cards/id" },
    ],
  },
]

export function Navigation(props: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav {...props}>
      <ul role="list">
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
