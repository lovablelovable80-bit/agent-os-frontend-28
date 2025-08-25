import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Award,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function FinancialMetrics() {
  const metricsFinanceiras = [
    { 
      label: "Novas O.S", 
      valor: "R$84.70k", 
      meta: "R$90k",
      progresso: 94,
      trend: 12.5,
      cor: "text-orange-500",
      icon: Target
    },
    { 
      label: "Peças", 
      valor: "R$12.52k", 
      meta: "R$15k",
      progresso: 83,
      trend: 8.3,
      cor: "text-green-500",
      icon: Award
    },
    { 
      label: "Serviços", 
      valor: "R$7.51k", 
      meta: "R$10k",
      progresso: 75,
      trend: -2.1,
      cor: "text-blue-500",
      icon: Target
    },
    { 
      label: "Faturado", 
      valor: "R$23.39k", 
      meta: "R$25k",
      progresso: 94,
      trend: 15.2,
      cor: "text-green-500",
      icon: DollarSign
    },
    { 
      label: "Margem/Peças", 
      valor: "R$2.55k", 
      meta: "R$3k",
      progresso: 85,
      trend: 5.7,
      cor: "text-purple-500",
      icon: TrendingUp
    },
    { 
      label: "Lucro/Parcial", 
      valor: "R$13.42k", 
      meta: "R$15k",
      progresso: 89,
      trend: 18.9,
      cor: "text-green-500",
      icon: Award
    }
  ];

  const osMetrics = [
    { 
      label: "O.S Ticket Médio", 
      valor: "R$806.54", 
      meta: "R$850",
      progresso: 95,
      trend: 6.2,
      cor: "text-orange-500",
      description: "Valor médio por ordem de serviço"
    },
    { 
      label: "O.S Andamento", 
      valor: "R$41.40k", 
      meta: "R$45k",
      progresso: 92,
      trend: 8.7,
      cor: "text-blue-500",
      description: "Valor total em execução"
    },
    { 
      label: "O.S Concluído", 
      valor: "R$5.55k", 
      meta: "R$8k",
      progresso: 69,
      trend: -3.2,
      cor: "text-green-500",
      description: "Valor total finalizado"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Financeiras Principais */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Métricas Financeiras
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metricsFinanceiras.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="transition-all duration-300 hover:scale-105 animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <Badge variant={metric.trend > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                      {metric.trend > 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(metric.trend)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className={`text-xl font-bold ${metric.cor}`}>{metric.valor}</div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Meta: {metric.meta}</span>
                        <span>{metric.progresso}%</span>
                      </div>
                      <Progress value={metric.progresso} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Métricas de O.S */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Métricas de Ordem de Serviço
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {osMetrics.map((metric, index) => (
            <Card key={index} className="transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{metric.label}</CardTitle>
                  <Badge variant={metric.trend > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                    {metric.trend > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(metric.trend)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={`text-2xl font-bold ${metric.cor}`}>{metric.valor}</div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Meta: {metric.meta}</span>
                    <span>{metric.progresso}%</span>
                  </div>
                  <Progress value={metric.progresso} className="h-2" />
                </div>
                
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}