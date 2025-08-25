import { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { FloatingAIChat } from "@/components/ai/FloatingAIChat";
import { MobileBottomNav } from "./MobileBottomNav";
import { ModernBottomNav } from "@/components/mobile/ModernBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNativeApp } from "@/hooks/useNativeApp";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { isNativeApp, platform } = useNativeApp();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  if (isMobile || isNativeApp) {
    return (
      <SidebarProvider defaultOpen={showMobileSidebar}>
        <div className={cn(
          "flex min-h-screen w-full bg-gradient-subtle",
          isNativeApp && "pt-safe full-screen-mobile"
        )}>
          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}
          
          {/* Sidebar that slides in from left */}
          <div className={cn(
            "fixed left-0 top-0 h-full w-80 z-50 transition-transform duration-300",
            showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
          )}>
            <div className="h-full bg-card border-r border-border/20 shadow-floating">
              <AppSidebar />
            </div>
          </div>
          
          <div className="flex flex-col flex-1">
            <AppHeader title={title} />
            
            <main className={cn(
              "flex-1 overflow-auto scrollable-mobile",
              isNativeApp ? "pb-24 pb-safe" : "pb-20"
            )}>
              <div className="px-mobile py-mobile space-y-mobile">
                {children}
              </div>
            </main>
            
            <ModernBottomNav onMenuClick={() => setShowMobileSidebar(true)} />
          </div>
        </div>
        <FloatingAIChat />
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <AppSidebar />
        
        <div className="flex flex-col flex-1">
          <AppHeader title={title} />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          
          <AppFooter />
        </div>
      </div>
      
      <FloatingAIChat />
    </SidebarProvider>
  );
}