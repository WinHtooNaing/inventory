"use client"

import { Calendar, Home, Inbox, Search, Settings, Ship } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "sale", url: "/branch/sale", icon: Home },
  { title: "products", url: "/branch/products", icon: Ship },
]

export function BranchSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            Ivan Web App
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`px-2 py-6 rounded-md transition
                        ${isActive 
                          ? "bg-accent text-accent-foreground font-semibold" 
                          : "hover:bg-accent/90 hover:text-accent-foreground/90"}
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
