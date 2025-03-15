
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <div className="flex items-center h-16 px-4 border-b bg-white shadow-sm">
            <SidebarTrigger />
            <h1 className="text-xl font-bold ml-4 bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent">SEO Manager</h1>
          </div>
          <div className="flex-1 p-6 overflow-auto bg-gray-50">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
