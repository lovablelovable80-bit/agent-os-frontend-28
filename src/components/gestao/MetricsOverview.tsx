import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  color?: "green" | "blue" | "orange" | "red";
}

const MetricCard = ({ title, value, trend, trendLabel, color = "green" }: MetricCardProps) => {
  const colorClasses = {
    green: "bg-green-500/10 border-green-500/20 text-green-500",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-500", 
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-500",
    red: "bg-red-500/10 border-red-500/20 text-red-500"
  };

  return (
    <Card className={`${colorClasses[color]} transition-all duration-300 hover:scale-105 animate-fade-in`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">{title}</div>
          {trend && (
            <Badge variant="outline" className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>
        <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[2]}`}>
          {value}
        </div>
        {trendLabel && (
          <div className="text-xs text-muted-foreground mt-1">{trendLabel}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MetricsOverview() {
  const topMetrics = [
    { title: "O.S", value: "R$23.39K", trend: 12.5, trendLabel: "vs último mês", color: "green" as const },
    { title: "Vendas", value: "R$4.71K", trend: 8.3, trendLabel: "vs último mês", color: "blue" as const },
    { title: "Total", value: "R$28.10K", trend: 15.2, trendLabel: "vs último mês", color: "orange" as const }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {topMetrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}