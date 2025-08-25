import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'minimal' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export function ModernCard({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick 
}: ModernCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-card/80 backdrop-blur-xl border-border/40';
      case 'gradient':
        return 'bg-gradient-card border-border/30';
      case 'elevated':
        return 'bg-card border-border/20 shadow-floating';
      case 'minimal':
        return 'bg-transparent border-border/10';
      case 'compact':
        return 'mobile-card p-3';
      default:
        return 'mobile-card';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-6';
      default:
        return 'p-mobile';
    }
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        getVariantStyles(),
        getSizeStyles(),
        'animate-fade-in',
        interactive && 'active-press cursor-pointer hover-lift',
        onClick && 'transition-all duration-200',
        className
      )}
    >
      {children}
    </Component>
  );
}

interface ModernSectionProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ModernSection({ 
  title, 
  subtitle, 
  icon: Icon, 
  action, 
  children, 
  className 
}: ModernSectionProps) {
  return (
    <div className={cn('space-y-mobile animate-slide-up', className)}>
      {(title || subtitle || Icon || action) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-mobile-lg font-bold text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-mobile-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}