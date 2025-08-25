import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Timer,
  Zap,
  AlertTriangle
} from "lucide-react";

export default function TimeMetrics() {
  const timeMetrics = [
    {
      label: "Tempo Médio Total",
      atual: "4.2 dias",
      anterior: "5.1 dias", 
      melhoria: 17.6,
      meta: "3.5 dias",
      progresso: 85,
      icon: Clock,
      color: "blue"
    },
    {
      label: "Tempo Diagnóstico",
      atual: "0.8 dias",
      anterior: "1.2 dias",
      melhoria: 33.3,
      meta: "0.5 dias",
      progresso: 62,
      icon: Timer,
      color: "green"
    },
    {
      label: "Tempo Execução",
      atual: "2.1 dias", 
      anterior: "2.8 dias",
      melhoria: 25.0,
      meta: "1.8 dias",
      progresso: 78,
      icon: Zap,
      color: "orange"
    },
    {
      label: "Tempo Aprovação",
      atual: "1.3 dias",
      anterior: "1.1 dias",
      melhoria: -18.2,
      meta: "0.8 dias",
      progresso: 45,
      icon: AlertTriangle,
      color: "red"
    }
  ];

  const fasesTempo = [
    { fase: "Recebimento", tempo: "2h", percentual: 8, cor: "#3B82F6" },
    { fase: "Diagnóstico", tempo: "19h", percentual: 32, cor: "#10B981" },
    { fase: "Orçamento", tempo: "6h", percentual: 15, cor: "#F59E0B" },
    { fase: "Execução", tempo: "50h", percentual: 35, cor: "#EF4444" },
    { fase: "Finalização", tempo: "4h", percentual: 10, cor: "#8B5CF6" }
  ];

  const colorClasses = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10", 
    orange: "text-orange-500 bg-orange-500/10",
    red: "text-red-500 bg-red-500/10"
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais de Tempo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {timeMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isImprovement = metric.melhoria > 0;
          
          return (
            <Card key={index} className="transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${colorClasses[metric.color as keyof typeof colorClasses].split(' ')[0]}`} />
                  <Badge variant={isImprovement ? "default" : "destructive"} className="flex items-center gap-1">
                    {isImprovement ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {Math.abs(metric.melhoria)}%
                  </Badge>
                </div>
                <CardTitle className="text-sm">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${colorClasses[metric.color as keyof typeof colorClasses].split(' ')[0]}`}>
                    {metric.atual}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Anterior: {metric.anterior}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Meta: {metric.meta}</span>
                    <span>{metric.progresso}%</span>
                  </div>
                  <Progress value={metric.progresso} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Breakdown por Fases */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Distribuição de Tempo por Fase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fasesTempo.map((fase, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: fase.cor }}
                    />
                    <span className="font-medium">{fase.fase}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{fase.tempo}</span>
                    <Badge variant="outline">{fase.percentual}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ 
                      backgroundColor: fase.cor, 
                      width: `${fase.percentual}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}