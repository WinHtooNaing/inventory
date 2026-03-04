"use client";

import { Calendar, Home, Inbox, Search, Settings, Ship } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const items = [
  { title: "sale", url: "/branch/sale", icon: Home },
  { title: "products", url: "/branch/products", icon: Ship },
];

export function BranchSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col items-center gap-3 my-5">
            <Image
              src="/logo.png"
              alt="Project Logo"
              width={200}
              height={60}
              className="rounded-lg"
            />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`px-2 py-6 rounded-md transition
                        ${
                          isActive
                            ? "bg-accent text-accent-foreground font-semibold"
                            : "hover:bg-accent/90 hover:text-accent-foreground/90"
                        }
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
