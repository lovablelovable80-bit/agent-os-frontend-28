import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, AlertTriangle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useMetas } from "@/hooks/useMetas";

export function ExecutiveSummary() {
  const { getEstatisticas, hasMetas } = useMetas();
  const estatisticasMetas = getEstatisticas();

  const osData = {
    total: 175,
    concluido: 75,
    andamento: 65,
    cancelado: 6
  };

  const clientesData = {
    total: 127
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total O.S</p>
                <p className="text-2xl font-bold text-orange-500">{osData.total}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold text-green-500">{osData.concluido}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-500">{osData.andamento}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                ⏳
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold text-purple-500">{clientesData.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status das Metas */}
      {hasMetas && estatisticasMetas ? (
        <Card className="animate-fade-in border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              🎯 Resumo das Metas
              <Badge variant="outline" className="text-primary border-primary">
                {estatisticasMetas.ativas} ativas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Faturamento</span>
                </div>
                <div className="text-xl font-bold text-green-500">
                  R$ {estatisticasMetas.totalFaturamento.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Meta total</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Progresso</span>
                </div>
                <div className="text-xl font-bold text-blue-500">
                  {estatisticasMetas.progressoMedio}%
                </div>
                <div className="text-sm text-muted-foreground">Média geral</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Margem</span>
                </div>
                <div className="text-xl font-bold text-orange-500">
                  {estatisticasMetas.margemMedia}%
                </div>
                <div className="text-sm text-muted-foreground">Meta de lucro</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Progresso geral das metas: {estatisticasMetas.progressoMedio}%
                </span>
                <Link to="/gestao-geral">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
              <div className="w-full bg-muted h-2 rounded-full mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(estatisticasMetas.progressoMedio, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma meta configurada</h3>
            <p className="text-muted-foreground mb-4">
              Configure metas para acompanhar o desempenho da sua assistência técnica
            </p>
            <Link to="/gestao-geral">
              <Button>
                Ir para Gestão Geral
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}