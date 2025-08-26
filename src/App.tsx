import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import POS from "./pages/POS";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Pecas from "./pages/Pecas";
import CRM from "./pages/CRM";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import GestaoGeral from "./pages/GestaoGeral";
import Cadastros from "./pages/Cadastros";
import Sales from "./pages/Sales";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import ClientLogin from "./pages/ClientLogin";
import ClientProfile from "./pages/ClientProfile";
import ClientSchedule from "./pages/ClientSchedule";
import Personalizacao from "./pages/Personalizacao";
import NotFound from "./pages/NotFound";
import IA from "./pages/IA";
import AccessControl from "./pages/AccessControl";
import Invoices from "./pages/Invoices";
import PhotoUploadMobile from "./pages/PhotoUploadMobile";
import VideoRecordingMobile from "./pages/VideoRecordingMobile";

const queryClient = new QueryClient();

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client-login" element={<ClientLogin />} />
            <Route path="/client-profile" element={<ClientProfile />} />
            <Route path="/client-schedule" element={<ClientSchedule />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout title="Dashboard">
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/services" element={
              <ProtectedRoute>
                <AppLayout title="Serviços">
                  <Services />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/pos" element={
              <ProtectedRoute>
                <AppLayout title="PDV">
                  <POS />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <AppLayout title="Clientes">
                  <Customers />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <AppLayout title="Produtos">
                  <Products />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/pecas" element={
              <ProtectedRoute>
                <AppLayout title="Peças">
                  <Pecas />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/crm" element={
              <ProtectedRoute>
                <AppLayout title="CRM">
                  <CRM />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <AppLayout title="Documentos">
                  <Documents />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout title="Configurações">
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/personalizacao" element={
              <ProtectedRoute>
                <AppLayout title="Personalização">
                  <Personalizacao />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/subscription" element={
              <ProtectedRoute>
                <AppLayout title="Assinatura">
                  <Subscription />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/gestao-geral" element={
              <ProtectedRoute>
                <AppLayout title="Gestão Geral">
                  <GestaoGeral />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/gestao-geral/cadastros" element={
              <ProtectedRoute>
                <AppLayout title="Cadastro de Metas">
                  <Cadastros />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/ia" element={
              <ProtectedRoute>
                <AppLayout title="Inteligência Artificial">
                  <IA />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute>
                <AppLayout title="Notas Fiscais">
                  <Invoices />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings/access-control" element={
              <ProtectedRoute>
                <AppLayout title="Controle de Acesso">
                  <AccessControl />
                </AppLayout>
              </ProtectedRoute>
            } />
          <Route path="/api/upload-photos/:sessionId" element={<PhotoUploadMobile />} />
          <Route path="/photo-upload-mobile" element={<PhotoUploadMobile />} />
          <Route path="/video-recording-mobile" element={<VideoRecordingMobile />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
