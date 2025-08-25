import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export function MobileHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  showMenu = true,
  onMenuClick,
  rightAction,
  className 
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-card border-b border-border/20 sticky top-0 z-40 backdrop-blur-lg bg-card/95",
      isNativeApp && "min-h-[60px]",
      className
    )}>
      {/* Left side */}
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className={cn(
              "p-2",
              config.touchTarget
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        {showMenu && !showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className={cn(
              "p-2",
              config.touchTarget
            )}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex-1">
          <h1 className={cn(
            "font-bold text-foreground",
            config.fontSize.title
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "text-muted-foreground",
              config.fontSize.base
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side */}
      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </div>
  );
}