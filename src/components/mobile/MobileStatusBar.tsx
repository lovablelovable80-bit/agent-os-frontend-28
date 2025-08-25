import { useEffect, useState } from "react";
import { Wifi, Battery, Signal } from "lucide-react";
import { useNativeApp } from "@/hooks/useNativeApp";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  title?: string;
  showTime?: boolean;
  className?: string;
}

export function MobileStatusBar({ title, showTime = true, className }: StatusBarProps) {
  const { isNativeApp, platform } = useNativeApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (showTime) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTime]);

  // Só mostra a status bar para apps nativos
  if (!isNativeApp) {
    return null;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 bg-card border-b border-border/20",
      platform === 'ios' && "pt-safe-area-inset-top",
      className
    )}>
      {/* Left side - Time */}
      {showTime && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {formatTime(currentTime)}
          </span>
        </div>
      )}

      {/* Center - Title */}
      {title && (
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-foreground">
            {title}
          </span>
        </div>
      )}

      {/* Right side - System indicators */}
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4 text-muted-foreground" />
        <Wifi className="w-4 h-4 text-muted-foreground" />
        <Battery className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}