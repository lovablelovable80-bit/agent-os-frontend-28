import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  Eye, 
  X, 
  Users, 
  FileText, 
  Package, 
  Bot,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Crown
} from 'lucide-react';

const simulatedUsage = {
  free: { services: 8, clients: 35, products: 45 },
  basic: { services: 45, clients: 280, products: 350 },
  premium: { services: 150, clients: 800, products: 1200 },
  enterprise: { services: 300, clients: 1500, products: 2000 }
};

export function PlanSimulation() {
  const { simulationMode, simulatedPlan, exitSimulation } = useSubscription();

  if (!simulationMode || !simulatedPlan) return null;

  const usage = simulatedUsage[simulatedPlan.id as keyof typeof simulatedUsage] || simulatedUsage.free;

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (current: number, max: number) => {
    if (max === -1) return 'success'; // unlimited
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'destructive';
    if (percentage >= 70) return 'warning';
    return 'primary';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-primary/20 shadow-2xl">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={exitSimulation}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Simulação do Plano {simulatedPlan.name}
              </CardTitle>
              <CardDescription>
                Veja como seria usar seu sistema com este plano
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-medium">Modo Simulação Ativo</span>
            </div>
            <Badge variant="default" className="bg-primary">
              {simulatedPlan.price === 0 ? 'Gratuito' : `R$ ${simulatedPlan.price.toFixed(2).replace('.', ',')}/mês`}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Usage Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Ordens de Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uso este mês</span>
                    <span className="font-medium">
                      {usage.services} {simulatedPlan.limitations.maxServices === -1 ? '' : `/ ${simulatedPlan.limitations.maxServices}`}
                    </span>
                  </div>
                  {simulatedPlan.limitations.maxServices !== -1 ? (
                    <Progress 
                      value={getUsagePercentage(usage.services, simulatedPlan.limitations.maxServices)} 
                      className="h-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Ilimitado</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cadastrados</span>
                    <span className="font-medium">
                      {usage.clients} {simulatedPlan.limitations.maxClients === -1 ? '' : `/ ${simulatedPlan.limitations.maxClients}`}
                    </span>
                  </div>
                  {simulatedPlan.limitations.maxClients !== -1 ? (
                    <Progress 
                      value={getUsagePercentage(usage.clients, simulatedPlan.limitations.maxClients)} 
                      className="h-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Ilimitado</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cadastrados</span>
                    <span className="font-medium">
                      {usage.products} {simulatedPlan.limitations.maxProducts === -1 ? '' : `/ ${simulatedPlan.limitations.maxProducts}`}
                    </span>
                  </div>
                  {simulatedPlan.limitations.maxProducts !== -1 ? (
                    <Progress 
                      value={getUsagePercentage(usage.products, simulatedPlan.limitations.maxProducts)} 
                      className="h-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Ilimitado</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Features Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recursos Disponíveis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className={`w-3 h-3 rounded-full ${simulatedPlan.limitations.hasAdvancedReports ? 'bg-success' : 'bg-muted'}`} />
                  <div className="flex-1">
                    <div className="font-medium">Relatórios Avançados</div>
                    <div className="text-sm text-muted-foreground">
                      {simulatedPlan.limitations.hasAdvancedReports 
                        ? 'Analytics detalhados, filtros avançados e exportação'
                        : 'Apenas relatórios básicos disponíveis'
                      }
                    </div>
                  </div>
                  {simulatedPlan.limitations.hasAdvancedReports ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className={`w-3 h-3 rounded-full ${simulatedPlan.limitations.hasAI ? 'bg-success' : 'bg-muted'}`} />
                  <div className="flex-1">
                    <div className="font-medium">IA Assistente</div>
                    <div className="text-sm text-muted-foreground">
                      {simulatedPlan.limitations.hasAI 
                        ? 'Assistente inteligente para suporte e automação'
                        : 'IA assistente não disponível neste plano'
                      }
                    </div>
                  </div>
                  {simulatedPlan.limitations.hasAI ? (
                    <Bot className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className={`w-3 h-3 rounded-full ${simulatedPlan.limitations.hasPriority ? 'bg-success' : 'bg-muted'}`} />
                  <div className="flex-1">
                    <div className="font-medium">Suporte Prioritário</div>
                    <div className="text-sm text-muted-foreground">
                      {simulatedPlan.limitations.hasPriority 
                        ? 'Suporte 24/7 com resposta prioritária'
                        : 'Suporte por email durante horário comercial'
                      }
                    </div>
                  </div>
                  {simulatedPlan.limitations.hasPriority ? (
                    <Shield className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <div className="flex-1">
                    <div className="font-medium">Armazenamento</div>
                    <div className="text-sm text-muted-foreground">
                      {simulatedPlan.limitations.storage} para arquivos e documentos
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Experience Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Experiência do Usuário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">Interface</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Dashboard personalizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {simulatedPlan.limitations.hasAdvancedReports ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={!simulatedPlan.limitations.hasAdvancedReports ? 'text-muted-foreground' : ''}>
                      Gráficos avançados
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {simulatedPlan.limitations.hasAI ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={!simulatedPlan.limitations.hasAI ? 'text-muted-foreground' : ''}>
                      Chat IA integrado
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">Automação</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Notificações automáticas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {simulatedPlan.limitations.hasAdvancedReports ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={!simulatedPlan.limitations.hasAdvancedReports ? 'text-muted-foreground' : ''}>
                      Relatórios automáticos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {simulatedPlan.limitations.hasAI ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={!simulatedPlan.limitations.hasAI ? 'text-muted-foreground' : ''}>
                      Sugestões inteligentes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={exitSimulation} variant="outline" className="flex-1">
              Fechar Simulação
            </Button>
            <Button 
              onClick={() => {
                exitSimulation();
                // Here you could trigger the actual subscription flow
              }}
              className="flex-1"
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar Este Plano
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}