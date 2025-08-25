import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Users, 
  FileText, 
  Package, 
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Mock usage data - in real app this would come from actual usage
const mockUsage = {
  services: 8, // out of 10 for free plan
  clients: 35, // out of 50 for free plan
  products: 45, // out of 100 for free plan
};

export function UsageDashboard() {
  const { currentPlan, getUsageLimits } = useSubscription();
  const navigate = useNavigate();
  const limits = getUsageLimits();

  const getUsageColor = (current: number, max: number) => {
    if (max === -1) return 'success'; // unlimited
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'destructive';
    if (percentage >= 70) return 'warning';
    return 'primary';
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // unlimited
    return Math.min((current / max) * 100, 100);
  };

  const usageItems = [
    {
      label: 'Ordens de Serviço',
      current: mockUsage.services,
      max: limits.maxServices,
      icon: FileText,
      period: 'este mês'
    },
    {
      label: 'Clientes',
      current: mockUsage.clients,
      max: limits.maxClients,
      icon: Users,
      period: 'total'
    },
    {
      label: 'Produtos',
      current: mockUsage.products,
      max: limits.maxProducts,
      icon: Package,
      period: 'cadastrados'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Uso do Plano {currentPlan.name}
        </CardTitle>
        <CardDescription>
          Acompanhe o uso dos recursos do seu plano atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Info */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <span className="font-medium">Plano {currentPlan.name}</span>
          </div>
          <Badge variant="outline">
            {currentPlan.price === 0 ? 'Gratuito' : `R$ ${currentPlan.price.toFixed(2).replace('.', ',')}/mês`}
          </Badge>
        </div>

        {/* Usage Statistics */}
        <div className="space-y-4">
          {usageItems.map((item) => {
            const Icon = item.icon;
            const percentage = getUsagePercentage(item.current, item.max);
            const color = getUsageColor(item.current, item.max);
            const isNearLimit = percentage >= 80 && item.max !== -1;
            
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {item.current} {item.max === -1 ? '' : `/ ${item.max}`}
                    </span>
                    {item.max === -1 && (
                      <Badge variant="outline" className="text-xs">
                        Ilimitado
                      </Badge>
                    )}
                    {isNearLimit && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
                
                {item.max !== -1 && (
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${color === 'destructive' ? 'bg-destructive/20' : ''}`}
                  />
                )}
                
                <p className="text-xs text-muted-foreground">
                  {item.period}
                  {isNearLimit && (
                    <span className="text-warning font-medium ml-2">
                      • Atenção: próximo do limite
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Plan Features */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Recursos do seu plano</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${limits.hasAdvancedReports ? 'bg-success' : 'bg-muted'}`} />
              <span className={limits.hasAdvancedReports ? 'text-foreground' : 'text-muted-foreground'}>
                Relatórios Avançados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${limits.hasAI ? 'bg-success' : 'bg-muted'}`} />
              <span className={limits.hasAI ? 'text-foreground' : 'text-muted-foreground'}>
                IA Assistente
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${limits.hasPriority ? 'bg-success' : 'bg-muted'}`} />
              <span className={limits.hasPriority ? 'text-foreground' : 'text-muted-foreground'}>
                Suporte Prioritário
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-foreground">
                {limits.storage} Storage
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        {currentPlan.id === 'free' && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-medium">Desbloquear mais recursos</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade para um plano premium e tenha acesso a recursos ilimitados, IA assistente e suporte prioritário.
            </p>
            <Button 
              onClick={() => navigate('/subscription')}
              size="sm"
              className="w-full"
            >
              Ver Planos Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}