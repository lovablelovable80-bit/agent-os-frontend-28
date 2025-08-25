import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  ShoppingCart,
  Users,
  Package,
  Cog,
  MessageSquare,
  FileText,
  Settings,
  Crown,
  ChevronLeft,
  Smartphone,
  TrendingUp,
  Palette,
  Bot,
  UserCheck,
  ChevronDown,
  Receipt
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  { title: "PDV", url: "/pos", icon: ShoppingCart },
  { title: "Clientes", url: "/customers", icon: Users },
  { title: "Produtos", url: "/products", icon: Package },
  { title: "CRM", url: "/crm", icon: MessageSquare },
  { title: "Documentos", url: "/documents", icon: FileText },
  { title: "Notas Fiscais", url: "/invoices", icon: Receipt },
  { title: "IA", url: "/ia", icon: Bot },
  { title: "Personalização", url: "/personalizacao", icon: Palette },
  { title: "Assinatura", url: "/subscription", icon: Crown },
];

const dashboardItems = [
  { title: "Dashboard Principal", url: "/", icon: LayoutDashboard },
  { title: "Gestão Geral", url: "/gestao-geral", icon: TrendingUp },
];

const servicesItems = [
  { title: "Ordens de Serviço", url: "/services", icon: Wrench },
  { title: "Peças", url: "/pecas", icon: Cog },
];

const settingsItems = [
  { title: "Configurações Gerais", url: "/settings", icon: Settings },
  { title: "Controle de Acesso", url: "/settings/access-control", icon: UserCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [settingsOpen, setSettingsOpen] = useState(currentPath.startsWith("/settings"));
  const [servicesOpen, setServicesOpen] = useState(currentPath.startsWith("/services") || currentPath.startsWith("/pecas"));
  const [dashboardOpen, setDashboardOpen] = useState(currentPath === "/" || currentPath.startsWith("/gestao-geral"));

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-sidebar-collapsed" : "w-sidebar"} transition-all duration-smooth border-r border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-glow">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-sidebar-foreground">AGENT OS</h1>
                <p className="text-xs text-sidebar-foreground/60">Assistência Técnica</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="px-2 py-4 flex-1">
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider mb-2">
              Menu Principal
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Dashboard com Subitens */}
              <SidebarMenuItem>
                <Collapsible 
                  open={dashboardOpen} 
                  onOpenChange={setDashboardOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-11 w-full">
                      <div className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="font-medium">Dashboard</span>
                            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${dashboardOpen ? "rotate-180" : ""}`} />
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-1">
                        {dashboardItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink 
                                to={subItem.url}
                                end={subItem.url === "/"}
                                className={getNavCls}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm">{subItem.title}</span>
                                </div>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Serviços com Subitens */}
              <SidebarMenuItem>
                <Collapsible 
                  open={servicesOpen} 
                  onOpenChange={setServicesOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-11 w-full">
                      <div className="flex items-center gap-3 w-full">
                        <Wrench className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="font-medium">Serviços</span>
                            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-1">
                        {servicesItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink 
                                to={subItem.url}
                                className={getNavCls}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm">{subItem.title}</span>
                                </div>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
              {/* Configurações com Subitens */}
              <SidebarMenuItem>
                <Collapsible 
                  open={settingsOpen} 
                  onOpenChange={setSettingsOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-11 w-full">
                      <div className="flex items-center gap-3 w-full">
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="font-medium">Configurações</span>
                            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-1">
                        {settingsItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink 
                                to={subItem.url}
                                className={getNavCls}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm">{subItem.title}</span>
                                </div>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collapse Button */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarTrigger className="w-full justify-center hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span className="ml-2 text-sm">Recolher</span>}
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}