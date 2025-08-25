import { useState } from "react";
import { Bell, Search, User, Moon, Sun, Menu, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePersonalization } from "@/hooks/usePersonalization";
import { MarketplaceIntegration } from "@/components/marketplace/MarketplaceIntegration";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const { settings, updateSetting } = usePersonalization();
  const isMobile = useIsMobile();
  const toggleDarkMode = () => {
    updateSetting('darkMode', !settings.darkMode);
  };

  return (
    <header className={`h-header bg-card border-b border-border flex items-center justify-between shadow-sm ${
      isMobile ? 'px-4' : 'px-6'
    }`}>
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {!isMobile && (
          <button className="lg:hidden p-2 hover:bg-muted rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex flex-col">
          <h1 className={`font-semibold text-foreground ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {title}
          </h1>
          {!isMobile && (
            <p className="text-sm text-muted-foreground">
              Gerencie sua assistência técnica
            </p>
          )}
        </div>
      </div>

      {/* Center Section - Search (Desktop only) */}
      {!isMobile && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes, serviços, produtos..."
              className="pl-10 bg-muted/50 border-muted focus:bg-background transition-colors"
            />
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
        {/* Search Icon for Mobile */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Search className="w-4 h-4" />
          </Button>
        )}

        {/* Marketplace Integration (Desktop only) */}
        {!isMobile && <MarketplaceIntegration />}

        {/* Dark Mode Toggle (Desktop only) */}
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="relative"
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative ${isMobile ? 'w-8 h-8' : ''}`}
        >
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-destructive text-destructive-foreground flex items-center justify-center">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isMobile ? 'w-8 h-8' : ''}`}
            >
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@agentOS.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}