import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: 'Jan', faturamento: 35000, servicos: 45 },
  { name: 'Fev', faturamento: 42000, servicos: 52 },
  { name: 'Mar', faturamento: 38000, servicos: 48 },
  { name: 'Abr', faturamento: 45000, servicos: 58 },
  { name: 'Mai', faturamento: 41000, servicos: 55 },
  { name: 'Jun', faturamento: 47580, servicos: 89 },
];

export function PerformanceChart() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="w-5 h-5 text-primary" />
          Performance dos Últimos 6 Meses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelFormatter={(label) => `Mês: ${label}`}
                formatter={(value, name) => [
                  name === 'faturamento' 
                    ? `R$ ${value.toLocaleString()}` 
                    : `${value} serviços`,
                  name === 'faturamento' ? 'Faturamento' : 'Serviços'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="faturamento" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="servicos" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Faturamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-sm text-muted-foreground">Serviços</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}