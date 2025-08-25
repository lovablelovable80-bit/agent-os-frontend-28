import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, Zap, AlertTriangle } from 'lucide-react';

interface PlanGateProps {
  children: ReactNode;
  requiredFeature?: keyof import('@/contexts/SubscriptionContext').Plan['limitations'];
  requiredPlan?: string[];
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function PlanGate({ 
  children, 
  requiredFeature, 
  requiredPlan = [], 
  fallback, 
  showUpgrade = true 
}: PlanGateProps) {
  const { currentPlan, isFeatureAllowed, upgradePrompt } = useSubscription();
  const navigate = useNavigate();

  // Check if user has required plan
  const hasPlan = requiredPlan.length === 0 || requiredPlan.includes(currentPlan.id);
  
  // Check if user has required feature
  const hasFeature = !requiredFeature || isFeatureAllowed(requiredFeature);

  const hasAccess = hasPlan && hasFeature;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-warning">
          <Lock className="w-5 h-5" />
          Recurso Premium
        </CardTitle>
        <CardDescription>
          Este recurso requer um plano superior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {requiredFeature && (
              <span className="block">
                Funcionalidade: <strong>{getFeatureName(requiredFeature)}</strong>
              </span>
            )}
            {requiredPlan.length > 0 && (
              <span className="block">
                Planos necessários: {requiredPlan.map(plan => 
                  <Badge key={plan} variant="outline" className="ml-1">
                    {getPlanName(plan)}
                  </Badge>
                )}
              </span>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/subscription')}
            className="flex-1"
          >
            <Crown className="w-4 h-4 mr-2" />
            Ver Planos
          </Button>
          <Button 
            variant="outline" 
            onClick={upgradePrompt}
            className="flex-1"
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade Rápido
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getFeatureName(feature: string): string {
  const featureNames: Record<string, string> = {
    hasAdvancedReports: 'Relatórios Avançados',
    hasAI: 'IA Assistente',
    hasPriority: 'Suporte Prioritário',
    maxServices: 'Limite de Serviços',
    maxClients: 'Limite de Clientes',
    maxProducts: 'Limite de Produtos'
  };
  return featureNames[feature] || feature;
}

function getPlanName(planId: string): string {
  const planNames: Record<string, string> = {
    free: 'Gratuito',
    basic: 'Básico',
    premium: 'Premium', 
    enterprise: 'Enterprise'
  };
  return planNames[planId] || planId;
}