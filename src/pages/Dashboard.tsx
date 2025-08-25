import { PageContainer } from "@/components/layout/PageContainer";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentServices } from "@/components/dashboard/RecentServices";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { TopMetrics } from "@/components/dashboard/TopMetrics";
import MetricsOverview from "@/components/gestao/MetricsOverview";
import { UsageDashboard } from "@/components/subscription/UsageDashboard";
import { PlanGate } from "@/components/subscription/PlanGate";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNativeApp } from "@/hooks/useNativeApp";
import ModernDashboard from "./ModernDashboard";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { isNativeApp } = useNativeApp();

  // Use design moderno para mobile e nativo
  if (isMobile || isNativeApp) {
    return <ModernDashboard />;
  }

  // Layout padrão para web e mobile browser
  return (
    <PageContainer 
      title="Dashboard" 
      description={!isMobile ? "Resumo geral da gestão da sua assistência técnica" : undefined}
    >
      <div className={`space-y-${isMobile ? '4' : '8'}`}>
        {/* Cards de Estatísticas Principais */}
        <StatsCards />
        
        {/* Dashboard de Uso do Plano */}
        <UsageDashboard />
        
        {/* Resumo Executivo das principais métricas */}
        <PlanGate requiredFeature="hasAdvancedReports">
          <ExecutiveSummary />
        </PlanGate>
        
        {/* Métricas Principais da Gestão Geral */}
        <PlanGate requiredFeature="hasAdvancedReports">
          <MetricsOverview />
        </PlanGate>
        
        {/* Layout Grid Principal */}
        <div className={`grid grid-cols-1 gap-${isMobile ? '4' : '6'} ${
          !isMobile ? 'xl:grid-cols-5' : ''
        }`}>
          {/* Serviços Recentes */}
          <div className={!isMobile ? "xl:col-span-2" : ""}>
            <RecentServices />
          </div>
          
          {/* Top Métricas da Gestão */}
          <div className={!isMobile ? "xl:col-span-2" : ""}>
            <PlanGate requiredFeature="hasAdvancedReports">
              <TopMetrics />
            </PlanGate>
          </div>
          
          {/* Ações Rápidas */}
          <div className={`space-y-${isMobile ? '4' : '6'} ${
            !isMobile ? 'xl:col-span-1' : ''
          }`}>
            <QuickActions />
            <PlanGate requiredFeature="hasAdvancedReports">
              <PerformanceChart />
            </PlanGate>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}