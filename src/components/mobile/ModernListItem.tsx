import { ReactNode } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ModernListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  avatar?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  showArrow?: boolean;
  onPress?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed' | 'card';
  disabled?: boolean;
}

export function ModernListItem({
  title,
  subtitle,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  avatar,
  leftContent,
  rightContent,
  badge,
  badgeVariant = 'default',
  showArrow = false,
  onPress,
  className,
  variant = 'default',
  disabled = false
}: ModernListItemProps) {
  const Component = onPress ? 'button' : 'div';

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'p-3';
      case 'detailed':
        return 'p-5';
      case 'card':
        return 'p-4 mobile-card mb-3';
      default:
        return 'p-4';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return 'w-8 h-8';
      case 'detailed':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  return (
    <Component
      onClick={onPress}
      disabled={disabled}
      className={cn(
        "w-full text-left flex items-center gap-4 transition-all duration-200",
        getVariantStyles(),
        variant !== 'card' && "border-b border-border/10 last:border-0",
        onPress && !disabled && "active-press cursor-pointer hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Left content or Icon/Avatar */}
      {leftContent || (Icon || avatar) && (
        <div className="flex-shrink-0">
          {leftContent || (
            <div className={cn(
              "rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0",
              getIconSize()
            )}>
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : Icon ? (
                <Icon className={cn("w-5 h-5", iconColor)} />
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={cn(
            "font-semibold text-foreground truncate",
            variant === 'compact' ? 'text-mobile-sm' : 'text-mobile-base'
          )}>
            {title}
          </h3>
          {badge && (
            <Badge variant={badgeVariant} className="ml-2 flex-shrink-0">
              {badge}
            </Badge>
          )}
        </div>
        
        {subtitle && (
          <p className={cn(
            "text-muted-foreground truncate",
            variant === 'compact' ? 'text-mobile-xs' : 'text-mobile-sm'
          )}>
            {subtitle}
          </p>
        )}
        
        {description && variant === 'detailed' && (
          <p className="text-mobile-sm text-muted-foreground mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Right content */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {rightContent}
        {(showArrow || onPress) && !disabled && (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    </Component>
  );
}

// Container para listas
interface ModernListProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'minimal';
}

export function ModernList({ children, className, variant = 'default' }: ModernListProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'mobile-card overflow-hidden';
      case 'minimal':
        return 'space-y-1';
      default:
        return 'mobile-card divide-y divide-border/10';
    }
  };

  return (
    <div className={cn(getVariantStyles(), className)}>
      {children}
    </div>
  );
}