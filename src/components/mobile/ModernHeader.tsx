import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, MoreVertical, Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  rightAction?: ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'gradient';
}

export function ModernHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  showSearch = false,
  showNotifications = false,
  showMenu = true,
  onMenuClick,
  onSearchClick,
  rightAction,
  className,
  variant = 'default'
}: ModernHeaderProps) {
  const navigate = useNavigate();
  const [notificationCount] = useState(3);

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-transparent border-0';
      case 'gradient':
        return 'bg-gradient-primary text-primary-foreground border-0';
      default:
        return 'bg-card/95 backdrop-blur-xl border-b border-border/20';
    }
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 px-mobile py-4',
      getVariantStyles(),
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="touch-target p-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          {showMenu && !showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="touch-target p-2 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            <h1 className={cn(
              "font-bold truncate",
              variant === 'gradient' ? 'text-primary-foreground' : 'text-foreground',
              subtitle ? 'text-mobile-lg' : 'text-mobile-xl'
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                "text-mobile-sm truncate mt-0.5",
                variant === 'gradient' ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              className="touch-target p-2 rounded-xl"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className="touch-target p-2 rounded-xl relative"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {notificationCount}
                </span>
              )}
            </Button>
          )}
          
          {rightAction}
        </div>
      </div>
    </header>
  );
}