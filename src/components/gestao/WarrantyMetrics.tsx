import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function WarrantyMetrics() {
  const garantiaMetrics = [
    {
      label: "Taxa de Garantia",
      valor: "8.5%",
      anterior: "12.3%",
      meta: "5%",
      progresso: 58,
      melhoria: -30.9,
      descricao: "Serviços que retornaram em garantia"
    },
    {
      label: "Tempo Médio Garantia",
      valor: "15 dias",
      anterior: "28 dias",
      meta: "10 dias",
      progresso: 67,
      melhoria: -46.4,
      descricao: "Tempo médio para retorno em garantia"
    },
    {
      label: "Custo de Garantia",
      valor: "R$ 8.2K",
      anterior: "R$ 15.1K",
      meta: "R$ 5K",
      progresso: 45,
      melhoria: -45.7,
      descricao: "Custo total com serviços de garantia"
    },
    {
      label: "Satisfação Pós-Garantia",
      valor: "92%",
      anterior: "87%",
      meta: "95%",
      progresso: 94,
      melhoria: 5.7,
      descricao: "Satisfação após resolução de garantia"
    }
  ];

  const garantiaPorTipo = [
    { tipo: "Defeito de Peça", quantidade: 12, percentual: 35, custo: "R$ 3.2K", cor: "#EF4444" },
    { tipo: "Erro de Instalação", quantidade: 8, percentual: 24, custo: "R$ 2.1K", cor: "#F59E0B" },
    { tipo: "Mau Contato", quantidade: 7, percentual: 21, custo: "R$ 1.8K", cor: "#8B5CF6" },
    { tipo: "Software", quantidade: 4, percentual: 12, custo: "R$ 0.8K", cor: "#10B981" },
    { tipo: "Outros", quantidade: 3, percentual: 8, custo: "R$ 0.3K", cor: "#6B7280" }
  ];

  const garantiaPorTecnico = [
    { nome: "Mark Zuckerberg", garantias: 8, taxa: "12.1%", impacto: "Alto", cor: "#EF4444" },
    { nome: "Terceirizado Elon", garantias: 5, taxa: "9.8%", impacto: "Médio", cor: "#F59E0B" },
    { nome: "Ana Carla", garantias: 3, taxa: "7.2%", impacto: "Baixo", cor: "#10B981" },
    { nome: "José Geraldo", garantias: 2, taxa: "4.1%", impacto: "Baixo", cor: "#10B981" },
    { nome: "Bill Gates", garantias: 1, taxa: "2.8%", impacto: "Muito Baixo", cor: "#3B82F6" }
  ];

  const acoesMelhoria = [
    {
      categoria: "Treinamento",
      acao: "Curso de soldagem avançada",
      prioridade: "Alta",
      impacto: "Redução de 40% em defeitos de solda",
      prazo: "30 dias",
      status: "Em andamento"
    },
    {
      categoria: "Processo",
      acao: "Checklist de qualidade obrigatório", 
      prioridade: "Alta",
      impacto: "Redução de 25% em erros de instalação",
      prazo: "15 dias",
      status: "Planejado"
    },
    {
      categoria: "Fornecedor",
      acao: "Auditoria em fornecedor de peças",
      prioridade: "Média",
      impacto: "Melhoria na qualidade de componentes",
      prazo: "45 dias", 
      status: "Pendente"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais de Garantia */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {garantiaMetrics.map((metric, index) => {
          const isImprovement = metric.melhoria < 0; // Para garantia, menos é melhor
          
          return (
            <Card key={index} className="transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Shield className="w-5 h-5 text-blue-500" />
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
                  <div className="text-2xl font-bold text-blue-500">{metric.valor}</div>
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
                
                <p className="text-xs text-muted-foreground">{metric.descricao}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Garantia por Tipo */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              🔍 Garantias por Tipo de Problema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {garantiaPorTipo.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.cor }}
                      />
                      <span className="font-medium">{item.tipo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{item.custo}</span>
                      <Badge variant="outline">{item.quantidade}</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ 
                        backgroundColor: item.cor, 
                        width: `${item.percentual}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Garantia por Técnico */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              👨‍🔧 Taxa de Garantia por Técnico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {garantiaPorTecnico.map((tecnico, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{tecnico.nome}</span>
                    <Badge 
                      variant="outline"
                      style={{ color: tecnico.cor, borderColor: tecnico.cor }}
                    >
                      {tecnico.impacto}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold" style={{ color: tecnico.cor }}>
                        {tecnico.garantias}
                      </div>
                      <div className="text-xs text-muted-foreground">Garantias</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: tecnico.cor }}>
                        {tecnico.taxa}
                      </div>
                      <div className="text-xs text-muted-foreground">Taxa</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações de Melhoria */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            🚀 Plano de Ações para Melhoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {acoesMelhoria.map((acao, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500">{acao.categoria}</Badge>
                    <div>
                      <div className="font-semibold">{acao.acao}</div>
                      <div className="text-sm text-muted-foreground">{acao.impacto}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={acao.prioridade === "Alta" ? "destructive" : "default"}
                    >
                      {acao.prioridade}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Prazo: {acao.prazo}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span>Status:</span>
                    <Badge 
                      variant={
                        acao.status === "Em andamento" ? "default" :
                        acao.status === "Planejado" ? "secondary" : "outline"
                      }
                    >
                      {acao.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}