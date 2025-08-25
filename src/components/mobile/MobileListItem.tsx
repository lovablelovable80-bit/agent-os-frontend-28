import { ReactNode } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";

interface MobileListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  rightContent?: ReactNode;
  showArrow?: boolean;
  onPress?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export function MobileListItem({
  title,
  subtitle,
  description,
  icon: Icon,
  rightContent,
  showArrow = false,
  onPress,
  className,
  variant = 'default'
}: MobileListItemProps) {
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();

  const Component = onPress ? 'button' : 'div';

  const getPadding = () => {
    switch (variant) {
      case 'compact':
        return 'p-3';
      case 'detailed':
        return isNativeApp ? 'p-5' : 'p-4';
      default:
        return 'p-4';
    }
  };

  return (
    <Component
      onClick={onPress}
      className={cn(
        "w-full text-left flex items-center gap-3 border-b border-border/10 transition-colors",
        getPadding(),
        config.touchTarget,
        onPress && "hover:bg-muted/50 active:bg-muted cursor-pointer",
        isNativeApp && "active:scale-98 transition-transform",
        className
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Icon */}
      {Icon && (
        <div className={cn(
          "rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0",
          variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
        )}>
          <Icon className={cn(
            "text-primary",
            variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'
          )} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-medium text-foreground truncate",
            config.fontSize.base
          )}>
            {title}
          </h3>
          {rightContent && (
            <div className="flex-shrink-0 ml-2">
              {rightContent}
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className={cn(
            "text-muted-foreground truncate mt-1",
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}>
            {subtitle}
          </p>
        )}
        
        {description && variant === 'detailed' && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Arrow */}
      {(showArrow || onPress) && (
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      )}
    </Component>
  );
}

// Lista container para items mobile
interface MobileListProps {
  children: ReactNode;
  className?: string;
  showDividers?: boolean;
}

export function MobileList({ children, className, showDividers = true }: MobileListProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg border border-border/20 overflow-hidden",
      !showDividers && "[&>*]:border-0",
      className
    )}>
      {children}
    </div>
  );
}