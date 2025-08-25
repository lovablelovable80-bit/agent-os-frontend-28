import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";
import { LucideIcon } from "lucide-react";

interface MobileCardProps {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'highlight';
  onPress?: () => void;
}

export function MobileCard({ 
  title, 
  icon: Icon, 
  children, 
  className, 
  variant = 'default',
  onPress 
}: MobileCardProps) {
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'p-4';
      case 'highlight':
        return `p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10`;
      default:
        return isNativeApp ? 'p-5' : 'p-4';
    }
  };

  const CardComponent = onPress ? 'button' : 'div';

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-200",
        onPress && "hover:shadow-md active:scale-98 cursor-pointer",
        isNativeApp && config.touchTarget,
        className
      )}
    >
      {onPress ? (
        <button
          onClick={onPress}
          className="w-full text-left"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <CardContent className={getVariantStyles()}>
            {title && (
              <div className="flex items-center gap-3 mb-4">
                {Icon && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                )}
                <h3 className={cn(
                  "font-semibold",
                  config.fontSize.title
                )}>
                  {title}
                </h3>
              </div>
            )}
            {children}
          </CardContent>
        </button>
      ) : (
        <>
          {title && (
            <CardHeader className={variant === 'compact' ? 'pb-2' : undefined}>
              <CardTitle className="flex items-center gap-3">
                {Icon && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className={config.fontSize.title}>{title}</span>
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className={getVariantStyles()}>
            {children}
          </CardContent>
        </>
      )}
    </Card>
  );
}

// Componente para lista de cards otimizada para mobile
interface MobileCardListProps {
  children: ReactNode;
  className?: string;
}

export function MobileCardList({ children, className }: MobileCardListProps) {
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();

  return (
    <div className={cn(
      config.cardSpacing,
      isNativeApp && "pb-4",
      className
    )}>
      {children}
    </div>
  );
}