import { useState, useEffect, ReactNode, createContext, useContext } from 'react';

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'annual';
  features: string[];
  limitations: {
    maxServices: number;
    maxClients: number;
    maxProducts: number;
    hasAdvancedReports: boolean;
    hasAI: boolean;
    hasPriority: boolean;
    storage: string;
  };
  color: string;
  popular?: boolean;
}

export interface UserSubscription {
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  billingCycle: 'monthly' | 'annual';
}

interface SubscriptionContextType {
  currentPlan: Plan;
  subscription: UserSubscription | null;
  plans: Plan[];
  subscribeToPlan: (planId: string, billingCycle: 'monthly' | 'annual') => void;
  cancelSubscription: () => void;
  isFeatureAllowed: (feature: keyof Plan['limitations']) => boolean;
  getUsageLimits: () => Plan['limitations'];
  upgradePrompt: () => void;
  // Simulation features
  simulationMode: boolean;
  simulatedPlan: Plan | null;
  enterSimulation: (planId: string) => void;
  exitSimulation: () => void;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    billing: 'monthly',
    features: [
      'Até 10 ordens de serviço por mês',
      'Até 50 clientes',
      'Cadastro básico de produtos',
      'Relatórios simples',
      '1GB de armazenamento'
    ],
    limitations: {
      maxServices: 10,
      maxClients: 50,
      maxProducts: 100,
      hasAdvancedReports: false,
      hasAI: false,
      hasPriority: false,
      storage: '1GB'
    },
    color: 'muted'
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 89.90,
    billing: 'monthly',
    features: [
      'Até 100 ordens de serviço por mês',
      'Até 500 clientes',
      'Gestão completa de produtos',
      'Relatórios avançados',
      'PDV integrado',
      '10GB de armazenamento',
      'Suporte por email'
    ],
    limitations: {
      maxServices: 100,
      maxClients: 500,
      maxProducts: 1000,
      hasAdvancedReports: true,
      hasAI: false,
      hasPriority: false,
      storage: '10GB'
    },
    color: 'primary'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 179.90,
    billing: 'monthly',
    features: [
      'Ordens de serviço ilimitadas',
      'Clientes ilimitados',
      'Produtos ilimitados',
      'Relatórios avançados + Analytics',
      'IA Assistente incluída',
      'PDV avançado',
      '50GB de armazenamento',
      'Suporte prioritário',
      'Integrações avançadas'
    ],
    limitations: {
      maxServices: -1, // -1 = unlimited
      maxClients: -1,
      maxProducts: -1,
      hasAdvancedReports: true,
      hasAI: true,
      hasPriority: true,
      storage: '50GB'
    },
    color: 'accent',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 399.90,
    billing: 'monthly',
    features: [
      'Tudo do Premium',
      'Multi-filiais',
      'API personalizada',
      'Relatórios customizados',
      'IA avançada + treinamento personalizado',
      'Armazenamento ilimitado',
      'Suporte 24/7',
      'Gerente de conta dedicado',
      'Onboarding personalizado'
    ],
    limitations: {
      maxServices: -1,
      maxClients: -1,
      maxProducts: -1,
      hasAdvancedReports: true,
      hasAI: true,
      hasPriority: true,
      storage: 'Unlimited'
    },
    color: 'warning'
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulatedPlan, setSimulatedPlan] = useState<Plan | null>(null);

  // Load subscription from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user-subscription');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if subscription is still valid
      const now = new Date();
      const endDate = new Date(parsed.endDate);
      if (endDate > now && parsed.status === 'active') {
        setSubscription(parsed);
      } else {
        // Subscription expired, set to free plan
        localStorage.removeItem('user-subscription');
      }
    }
  }, []);

  // Save subscription to localStorage
  useEffect(() => {
    if (subscription) {
      localStorage.setItem('user-subscription', JSON.stringify(subscription));
    }
  }, [subscription]);

  const getCurrentPlan = (): Plan => {
    // If in simulation mode, return simulated plan
    if (simulationMode && simulatedPlan) {
      return simulatedPlan;
    }
    
    if (!subscription || subscription.status !== 'active') {
      return plans[0]; // Free plan
    }
    return plans.find(p => p.id === subscription.planId) || plans[0];
  };

  const subscribeToPlan = (planId: string, billingCycle: 'monthly' | 'annual') => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const startDate = new Date();
    const endDate = new Date();
    
    // Add time based on billing cycle
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const newSubscription: UserSubscription = {
      planId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      billingCycle
    };

    setSubscription(newSubscription);
  };

  const cancelSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: 'cancelled'
      });
    }
  };

  const isFeatureAllowed = (feature: keyof Plan['limitations']): boolean => {
    const currentPlan = getCurrentPlan();
    const limitation = currentPlan.limitations[feature];
    
    if (typeof limitation === 'boolean') {
      return limitation;
    }
    
    // For numeric limitations, return true if unlimited (-1) or if within limits
    if (typeof limitation === 'number') {
      return limitation === -1; // -1 means unlimited
    }
    
    return true;
  };

  const getUsageLimits = (): Plan['limitations'] => {
    return getCurrentPlan().limitations;
  };

  const upgradePrompt = () => {
    // This could trigger a modal or redirect to pricing page
    alert('Upgrade seu plano para acessar este recurso!');
  };

  const enterSimulation = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSimulatedPlan(plan);
      setSimulationMode(true);
    }
  };

  const exitSimulation = () => {
    setSimulationMode(false);
    setSimulatedPlan(null);
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan: getCurrentPlan(),
      subscription,
      plans,
      subscribeToPlan,
      cancelSubscription,
      isFeatureAllowed,
      getUsageLimits,
      upgradePrompt,
      simulationMode,
      simulatedPlan,
      enterSimulation,
      exitSimulation
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}