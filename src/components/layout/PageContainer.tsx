import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function PageContainer({ 
  children, 
  className, 
  title, 
  description, 
  action 
}: PageContainerProps) {
  return (
    <div className={cn("flex-1 p-6 bg-background min-h-full", className)}>
      {/* Page Header */}
      {(title || description || action) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {title && (
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            )}
            {action && action}
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}