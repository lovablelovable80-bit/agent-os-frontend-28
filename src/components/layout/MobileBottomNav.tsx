import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Headphones, 
  Package, 
  CreditCard, 
  Menu,
  Camera,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";

interface MobileBottomNavProps {
  onMenuClick?: () => void;
}

// Navegação básica para todos os dispositivos
const baseNavItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/services",
    label: "Assistência",
    icon: Headphones,
  },
  {
    path: "/customers",
    label: "Clientes",
    icon: Package,
  },
  {
    path: "/menu",
    label: "Menu",
    icon: Menu,
    isMenu: true,
  },
];

// Itens adicionais para app nativo
const nativeNavItems = [
  {
    path: "/",
    label: "Início",
    icon: LayoutDashboard,
  },
  {
    path: "/services",
    label: "Ordens",
    icon: Headphones,
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

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();

  // Seleciona os itens de navegação baseado no tipo de app
  const navItems = isNativeApp ? nativeNavItems : baseNavItems;

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleMenuClick = () => {
    onMenuClick?.();
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/40 backdrop-blur-lg bg-card/95 ${
      isNativeApp ? config.safePadding.bottom : ''
    }`}>
      <div className={`flex items-center justify-around ${config.navigation.height} px-1`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => item.isMenu ? handleMenuClick() : navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-1" />
                {item.path === "/subscription" && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-2 h-2 p-0 rounded-full"
                  />
                )}
              </div>
              <span className="text-xs font-medium truncate leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}