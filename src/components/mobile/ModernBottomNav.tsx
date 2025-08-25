import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home,
  Wrench,
  Users,
  Camera,
  Video,
  Menu,
  Settings,
  BarChart3,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNativeApp } from "@/hooks/useNativeApp";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  badge?: number;
  isNativeOnly?: boolean;
  isMenu?: boolean;
}

const baseNavItems: NavItem[] = [
  {
    path: "/",
    label: "Início",
    icon: Home,
  },
  {
    path: "/services",
    label: "Ordens",
    icon: Wrench,
    badge: 3,
  },
  {
    path: "/customers",
    label: "Clientes",
    icon: Users,
  },
  {
    path: "/menu",
    label: "Menu",
    icon: Menu,
    isMenu: true,
  },
];

const nativeNavItems: NavItem[] = [
  {
    path: "/",
    label: "Início",
    icon: Home,
  },
  {
    path: "/services",
    label: "Ordens",
    icon: Wrench,
    badge: 3,
  },
  {
    path: "/photo-upload-mobile",
    label: "Fotos",
    icon: Camera,
    isNativeOnly: true,
  },
  {
    path: "/video-recording-mobile",
    label: "Vídeos",
    icon: Video,
    isNativeOnly: true,
  },
  {
    path: "/menu",
    label: "Menu",
    icon: Menu,
    isMenu: true,
  },
];

interface ModernBottomNavProps {
  onMenuClick?: () => void;
}

export function ModernBottomNav({ onMenuClick }: ModernBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();

  const navItems = isNativeApp ? nativeNavItems : baseNavItems;

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.isMenu) {
      onMenuClick?.();
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/20 px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 relative",
                  "touch-target active-press",
                  active
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="relative">
                  <Icon className={cn(
                    "mb-1 transition-transform duration-200",
                    active ? "w-6 h-6" : "w-5 h-5"
                  )} />
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full text-xs flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium truncate leading-none",
                  active ? "text-primary-foreground" : "text-inherit"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}