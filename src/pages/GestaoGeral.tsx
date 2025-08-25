import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Calendar, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMetas } from "@/hooks/useMetas";
import MetricsOverview from "@/components/gestao/MetricsOverview";
import AdvancedFilters from "@/components/gestao/AdvancedFilters";
import OSStatusCircles from "@/components/gestao/OSStatusCircles";
import InteractiveCharts from "@/components/gestao/InteractiveCharts";
import FinancialMetrics from "@/components/gestao/FinancialMetrics";
import TimeMetrics from "@/components/gestao/TimeMetrics";
import ServiceRanking from "@/components/gestao/ServiceRanking";
import WarrantyMetrics from "@/components/gestao/WarrantyMetrics";
import ImprovementSuggestions from "@/components/gestao/ImprovementSuggestions";
import CommissionSystem from "@/components/gestao/CommissionSystem";

export default function GestaoGeral() {
  const { getEstatisticas, getMetaPorTipo, isMetaCumprida, hasMetas } = useMetas();
  const estatisticasMetas = getEstatisticas();
  // Mock data for OS (Ordens de Serviço)
  const osData = {
    total: 175,
    media: 0.480,
    concluido: 75,
    cancelado: 6,
    finalizado: 29,
    andamento: 65
  };

  const clientesData = {
    total: 127,
    media: 0.348
  };

  const canalAquisicao = [
    { nome: "Google", valor: 24, cor: "#4285F4", trend: 12.5 },
    { nome: "Facebook", valor: 11, cor: "#1877F2", trend: -2.3 },
    { nome: "Instagram", valor: 11, cor: "#E4405F", trend: 8.7 },
    { nome: "Indicação", valor: 16, cor: "#00D4AA", trend: 15.2 },
    { nome: "MercadoLivre", valor: 0, cor: "#FFE600", trend: 0 },
    { nome: "Panfleto", valor: 1, cor: "#FF6B6B", trend: -50 },
    { nome: "Outdoor", valor: 1, cor: "#845EC2", trend: 0 }
  ];

  const vendasPorSemana = [
    { semana: "Semana1", valor: 1560 }
  ];

  const vendasPorVendedor = [
    { vendedor: "Ana Carla", vendas: 8, produtos: 12, valor: 1650 }
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            <Settings className="w-10 h-10 text-primary" />
            GESTÃO AVANÇADA
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Dashboard executivo inteligente com análises em tempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            Atualizado há 2 min
          </Badge>
          <Link to="/gestao-geral/cadastros">
            <Button variant="outline" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Cadastrar Metas
            </Button>
          </Link>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600">
            <Calendar className="w-4 h-4" />
            Configurar Período
          </Button>
        </div>
      </div>

      {/* Integração com Metas */}
      {hasMetas && estatisticasMetas && (
        <Card className="animate-fade-in border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              🎯 Status das Metas Configuradas
              <Badge variant="outline" className="text-primary border-primary">
                {estatisticasMetas.ativas} ativas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Vendas</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-green-500">
                  R$ {estatisticasMetas.totalVendas.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Meta total configurada</div>
              </div>
              
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Faturamento</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-blue-500">
                  R$ {estatisticasMetas.totalFaturamento.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Meta mensal</div>
              </div>
              
              <div className="p-3 bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Progresso</span>
                  <Target className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold text-orange-500">
                  {estatisticasMetas.progressoMedio}%
                </div>
                <div className="text-xs text-muted-foreground">Média geral</div>
              </div>
              
              <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Margem</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-xl font-bold text-purple-500">
                  {estatisticasMetas.margemMedia}%
                </div>
                <div className="text-xs text-muted-foreground">Meta de lucro</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      <AdvancedFilters />

      {/* Top Metrics Overview */}
      <MetricsOverview />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - OS Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                📊 Resumo O.S
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-lg">
                <div className="text-4xl font-bold text-orange-500">{osData.total}</div>
                <div className="text-sm text-muted-foreground">Total de O.S</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{osData.concluido}</div>
                  <div className="text-xs text-muted-foreground">Concluído</div>
                </div>
                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{osData.andamento}</div>
                  <div className="text-xs text-muted-foreground">Andamento</div>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">{osData.cancelado}</div>
                  <div className="text-xs text-muted-foreground">Cancelado</div>
                </div>
                <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{clientesData.total}</div>
                  <div className="text-xs text-muted-foreground">Clientes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Acquisition Channels */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                📈 Canais de Aquisição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canalAquisicao.map((canal, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: canal.cor }}>
                      {canal.nome}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" style={{ color: canal.cor, borderColor: canal.cor }}>
                        {canal.valor}
                      </Badge>
                      {canal.trend && (
                        <Badge variant={canal.trend > 0 ? "default" : "destructive"} className="text-xs">
                          {canal.trend > 0 ? "+" : ""}{canal.trend}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ 
                        backgroundColor: canal.cor, 
                        width: `${(canal.valor / 25) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Columns - Enhanced Charts and Status */}
        <div className="lg:col-span-3 space-y-8">
          {/* Interactive OS Status */}
          <OSStatusCircles />

          {/* Advanced Interactive Charts */}
          <InteractiveCharts />
        </div>
      </div>

      {/* Enhanced Financial Metrics */}
      <FinancialMetrics />

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="tempo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-muted p-1 rounded-lg">
          <TabsTrigger value="tempo" className="flex items-center gap-2">
            ⏱️ Métricas de Tempo
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            🏆 Rankings
          </TabsTrigger>
          <TabsTrigger value="garantia" className="flex items-center gap-2">
            🛡️ Garantias
          </TabsTrigger>
          <TabsTrigger value="comissoes" className="flex items-center gap-2">
            💰 Comissões
          </TabsTrigger>
          <TabsTrigger value="melhorias" className="flex items-center gap-2">
            🚀 Melhorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tempo" className="space-y-6">
          <TimeMetrics />
        </TabsContent>

        <TabsContent value="ranking" className="space-y-6">
          <ServiceRanking />
        </TabsContent>

        <TabsContent value="garantia" className="space-y-6">
          <WarrantyMetrics />
        </TabsContent>

        <TabsContent value="comissoes" className="space-y-6">
          <CommissionSystem />
        </TabsContent>

        <TabsContent value="melhorias" className="space-y-6">
          <ImprovementSuggestions />
        </TabsContent>
      </Tabs>

      {/* Enhanced Sales Section */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            💰 Centro de Vendas Avançado
            <Badge variant="outline">Em Tempo Real</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">📅 Performance Semanal</h4>
              <div className="space-y-3">
                {vendasPorSemana.map((item, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.semana}</span>
                      <span className="text-xl font-bold text-green-500">
                        R${item.valor.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">👥 Top Vendedores</h4>
              <div className="space-y-3">
                {vendasPorVendedor.map((vendedor, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{vendedor.vendedor}</span>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500">
                        ⭐ Top Performer
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-500">{vendedor.vendas}</div>
                        <div className="text-xs text-muted-foreground">Vendas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-500">{vendedor.produtos}</div>
                        <div className="text-xs text-muted-foreground">Produtos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-500">R${vendedor.valor}</div>
                        <div className="text-xs text-muted-foreground">Valor</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">🎯 Metas e Objetivos</h4>
              {hasMetas && estatisticasMetas ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Meta de Faturamento</span>
                      <Badge className={`${estatisticasMetas.progressoMedio >= 80 ? 'bg-green-500' : estatisticasMetas.progressoMedio >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {estatisticasMetas.progressoMedio >= 80 ? '🎉 Excelente' : estatisticasMetas.progressoMedio >= 50 ? '⚠️ Atenção' : '🚨 Crítico'}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-500 mb-2">
                      R$ {estatisticasMetas.totalFaturamento.toLocaleString()}
                    </div>
                    <div className="w-full bg-muted h-3 rounded-full mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(estatisticasMetas.progressoMedio, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Progresso: {estatisticasMetas.progressoMedio}%</span>
                      <span>{estatisticasMetas.ativas} metas ativas</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-br from-gray-500/10 to-gray-600/5 rounded-lg text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-lg font-medium text-muted-foreground mb-2">Nenhuma meta configurada</div>
                  <Link to="/gestao-geral/cadastros">
                    <Button variant="outline" size="sm">
                      Configurar Metas
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}