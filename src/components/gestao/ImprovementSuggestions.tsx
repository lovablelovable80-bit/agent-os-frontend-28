import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Calendar,
  DollarSign
} from "lucide-react";

export default function ImprovementSuggestions() {
  const indicadoresMelhoria = [
    {
      area: "Tempo de Resposta",
      atual: "4.2h",
      meta: "2h", 
      progresso: 48,
      impacto: "Alto",
      cor: "red",
      tendencia: -15.2
    },
    {
      area: "Primeira Chamada",
      atual: "73%",
      meta: "85%",
      progresso: 86,
      impacto: "Alto", 
      cor: "orange",
      tendencia: 8.3
    },
    {
      area: "Retrabalho",
      atual: "12%",
      meta: "5%",
      progresso: 42,
      impacto: "Médio",
      cor: "yellow",
      tendencia: -3.1
    },
    {
      area: "Produtividade",
      atual: "85%",
      meta: "92%",
      progresso: 92,
      impacto: "Alto",
      cor: "green",
      tendencia: 12.7
    }
  ];

  const sugestoesPrioritarias = [
    {
      id: 1,
      titulo: "Implementar Sistema de Triagem Inteligente",
      categoria: "Processo",
      impacto: "Alto",
      prazo: "30 dias",
      custo: "R$ 15K",
      roi: "180%",
      beneficios: ["Redução de 40% no tempo de diagnóstico", "Melhoria na alocação de técnicos"],
      prioridade: "Crítica",
      status: "Recomendado"
    },
    {
      id: 2,
      titulo: "Programa de Treinamento Avançado",
      categoria: "Pessoas",
      impacto: "Alto", 
      prazo: "45 dias",
      custo: "R$ 25K",
      roi: "220%",
      beneficios: ["Redução de 30% em garantias", "Aumento de 25% na produtividade"],
      prioridade: "Alta",
      status: "Em análise"
    },
    {
      id: 3,
      titulo: "Automação de Relatórios",
      categoria: "Tecnologia",
      impacto: "Médio",
      prazo: "20 dias", 
      custo: "R$ 8K",
      roi: "150%",
      beneficios: ["Economia de 10h/semana", "Maior precisão nos dados"],
      prioridade: "Média",
      status: "Aprovado"
    },
    {
      id: 4,
      titulo: "Revisão de Fornecedores",
      categoria: "Qualidade",
      impacto: "Alto",
      prazo: "60 dias",
      custo: "R$ 5K", 
      roi: "300%",
      beneficios: ["Redução de 50% em defeitos de peças", "Melhoria na qualidade geral"],
      prioridade: "Alta",
      status: "Pendente"
    }
  ];

  const melhoriasPorArea = [
    {
      area: "Eficiência Operacional",
      melhorias: [
        { item: "Otimizar rota de técnicos", impacto: "15% economia de tempo" },
        { item: "Padronizar ferramentas", impacto: "20% redução setup" },
        { item: "App mobile para técnicos", impacto: "30% melhoria comunicação" }
      ]
    },
    {
      area: "Qualidade de Serviço", 
      melhorias: [
        { item: "Checklist de qualidade obrigatório", impacto: "40% redução erros" },
        { item: "Feedback em tempo real", impacto: "25% melhoria satisfação" },
        { item: "Certificação de técnicos", impacto: "35% redução garantias" }
      ]
    },
    {
      area: "Experiência do Cliente",
      melhorias: [
        { item: "Portal self-service", impacto: "50% redução chamadas" },
        { item: "SMS de acompanhamento", impacto: "30% melhoria NPS" },
        { item: "Agendamento online", impacto: "60% melhoria conversão" }
      ]
    }
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch(prioridade) {
      case "Crítica": return "bg-red-500";
      case "Alta": return "bg-orange-500";
      case "Média": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Aprovado": return "text-green-500 bg-green-500/10";
      case "Em análise": return "text-blue-500 bg-blue-500/10";
      case "Pendente": return "text-orange-500 bg-orange-500/10";
      default: return "text-purple-500 bg-purple-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicadores de Melhoria */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {indicadoresMelhoria.map((indicador, index) => (
          <Card key={index} className="transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Target className="w-5 h-5 text-blue-500" />
                <Badge variant={indicador.impacto === "Alto" ? "destructive" : "default"}>
                  {indicador.impacto}
                </Badge>
              </div>
              <CardTitle className="text-sm">{indicador.area}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-500">{indicador.atual}</div>
                <div className="text-xs text-muted-foreground">Meta: {indicador.meta}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progresso</span>
                  <span>{indicador.progresso}%</span>
                </div>
                <Progress value={indicador.progresso} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>Tendência:</span>
                <Badge variant={indicador.tendencia > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {Math.abs(indicador.tendencia)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sugestões Prioritárias */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            💡 Sugestões Prioritárias de Melhoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sugestoesPrioritarias.map((sugestao, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full mt-2 ${getPrioridadeColor(sugestao.prioridade)}`}
                    />
                    <div>
                      <div className="font-semibold text-lg">{sugestao.titulo}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{sugestao.categoria}</Badge>
                        <Badge className={getPrioridadeColor(sugestao.prioridade)}>
                          {sugestao.prioridade}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(sugestao.status)}>
                          {sugestao.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Detalhes <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Prazo: {sugestao.prazo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Custo: {sugestao.custo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-500">ROI: {sugestao.roi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Impacto: {sugestao.impacto}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium text-sm">Benefícios Esperados:</div>
                  {sugestao.beneficios.map((beneficio, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {beneficio}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Melhorias por Área */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {melhoriasPorArea.map((area, index) => (
          <Card key={index} className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                {area.area}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {area.melhorias.map((melhoria, idx) => (
                  <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm mb-1">{melhoria.item}</div>
                    <div className="text-xs text-green-600 font-semibold">
                      📈 {melhoria.impacto}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}