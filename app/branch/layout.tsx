import AppTopBar from "@/components/app-topbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BranchSidebar } from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <BranchSidebar />
      <main className="w-full">
        <div className="w-full h-auto  border-b border-gray-200 flex items-center shadow-sm">
          <SidebarTrigger />
          <AppTopBar />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
