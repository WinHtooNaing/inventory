
import { AppSidebar } from "@/components/app-sidebar"
import AppTopBar from "@/components/app-topbar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="w-full h-auto  border-b border-gray-200 flex items-center shadow-sm">
          <SidebarTrigger />
        <AppTopBar/>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
