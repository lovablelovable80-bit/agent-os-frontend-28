import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  CreditCard,
  Calendar,
  Users,
  Package,
  FileText,
  Bot,
  Shield,
  Headphones,
  Eye
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { PlanSimulation } from "@/components/subscription/PlanSimulation";

export default function Subscription() {
  const { plans, currentPlan, subscription, subscribeToPlan, enterSimulation } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      toast({
        title: "Plano Gratuito Ativado",
        description: "Você está usando o plano gratuito com limitações.",
      });
      return;
    }

    subscribeToPlan(planId, billingCycle);
    toast({
      title: "Assinatura Ativada!",
      description: `Plano ${plans.find(p => p.id === planId)?.name} ativado com sucesso!`,
    });
  };

  const getPrice = (price: number) => {
    if (price === 0) return "Gratuito";
    const finalPrice = billingCycle === 'annual' ? price * 9.6 : price; // 20% discount on annual (12 months for price of 9.6)
    return `R$ ${finalPrice.toFixed(2).replace('.', ',')}`;
  };

  const getPeriod = () => {
    return billingCycle === 'annual' ? '/ano' : '/mês';
  };

  return (
    <PageContainer>
      <PlanSimulation />
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Escolha seu Plano
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre o plano perfeito para o seu negócio. Comece grátis e evolua conforme sua necessidade.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 p-1 bg-muted rounded-lg w-fit mx-auto">
            <span className={`px-4 py-2 ${billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
            />
            <span className={`px-4 py-2 ${billingCycle === 'annual' ? 'font-medium' : 'text-muted-foreground'}`}>
              Anual
              <Badge variant="default" className="ml-2 text-xs">
                20% OFF
              </Badge>
            </span>
          </div>
        </div>

        {/* Current Plan Status */}
        {subscription && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Seu Plano Atual: {currentPlan.name}
              </CardTitle>
              <CardDescription>
                {subscription.status === 'active' 
                  ? `Ativo até ${new Date(subscription.endDate).toLocaleDateString('pt-BR')}`
                  : 'Plano inativo'
                }
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan.id === plan.id;
            const Icon = plan.id === 'free' ? Package : 
                       plan.id === 'basic' ? Zap : 
                       plan.id === 'premium' ? Star : Crown;

            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'border-primary shadow-md scale-105' : ''
                } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 rounded-lg bg-${plan.color}/10 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 text-${plan.color}`} />
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-foreground">
                      {getPrice(plan.price)}
                    </div>
                    {plan.price > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {getPeriod()}
                        {billingCycle === 'annual' && (
                          <span className="block text-xs text-success">
                            Economize R$ {(plan.price * 2.4).toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "secondary" : plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Plano Atual
                        </>
                      ) : plan.id === 'free' ? (
                        'Usar Gratuito'
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Assinar Agora
                        </>
                      )}
                    </Button>
                    
                    {!isCurrentPlan && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => enterSimulation(plan.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Simular Plano
                      </Button>
                    )}
                  </div>

                  {isCurrentPlan && subscription && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Renovação: {new Date(subscription.endDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Comparação Detalhada</CardTitle>
            <CardDescription>
              Veja todas as funcionalidades incluídas em cada plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Funcionalidade</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-4">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Ordens de Serviço</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.maxServices === -1 ? 'Ilimitado' : `${plan.limitations.maxServices}/mês`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Clientes</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.maxClients === -1 ? 'Ilimitado' : plan.limitations.maxClients}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Produtos</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.maxProducts === -1 ? 'Ilimitado' : plan.limitations.maxProducts}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Relatórios Avançados</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.hasAdvancedReports ? 
                          <Check className="w-4 h-4 text-success mx-auto" /> : 
                          <span className="text-muted-foreground">-</span>
                        }
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">IA Assistente</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.hasAI ? 
                          <Check className="w-4 h-4 text-success mx-auto" /> : 
                          <span className="text-muted-foreground">-</span>
                        }
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Suporte Prioritário</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.hasPriority ? 
                          <Check className="w-4 h-4 text-success mx-auto" /> : 
                          <span className="text-muted-foreground">Email</span>
                        }
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Armazenamento</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.limitations.storage}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso aos recursos premium até o final do período de cobrança.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">E se eu exceder os limites do meu plano?</h4>
              <p className="text-sm text-muted-foreground">
                Quando você atingir os limites do seu plano, será notificado e poderá fazer upgrade para um plano superior.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Há desconto no plano anual?</h4>
              <p className="text-sm text-muted-foreground">
                Sim! Assinando anualmente, você ganha 20% de desconto, economizando significativamente em comparação ao plano mensal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}