import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SubscriptionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/sales" element={<Sales />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/client-schedule" element={<ClientSchedule />} />
          <Route path="/" element={
            <AppLayout title="Dashboard">
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/services" element={
            <AppLayout title="Serviços">
              <Services />
            </AppLayout>
          } />
          <Route path="/pos" element={
            <AppLayout title="PDV">
              <POS />
            </AppLayout>
          } />
          <Route path="/customers" element={
            <AppLayout title="Clientes">
              <Customers />
            </AppLayout>
          } />
          <Route path="/products" element={
            <AppLayout title="Produtos">
              <Products />
            </AppLayout>
          } />
          <Route path="/pecas" element={
            <AppLayout title="Peças">
              <Pecas />
            </AppLayout>
          } />
          <Route path="/crm" element={
            <AppLayout title="CRM">
              <CRM />
            </AppLayout>
          } />
          <Route path="/documents" element={
            <AppLayout title="Documentos">
              <Documents />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout title="Configurações">
              <Settings />
            </AppLayout>
          } />
          <Route path="/personalizacao" element={
            <AppLayout title="Personalização">
              <Personalizacao />
            </AppLayout>
          } />
          <Route path="/subscription" element={
            <AppLayout title="Assinatura">
              <Subscription />
            </AppLayout>
          } />
          <Route path="/gestao-geral" element={
            <AppLayout title="Gestão Geral">
              <GestaoGeral />
            </AppLayout>
          } />
          <Route path="/gestao-geral/cadastros" element={
            <AppLayout title="Cadastro de Metas">
              <Cadastros />
            </AppLayout>
          } />
          <Route path="/ia" element={
            <AppLayout title="Inteligência Artificial">
              <IA />
            </AppLayout>
          } />
          <Route path="/invoices" element={
            <AppLayout title="Notas Fiscais">
              <Invoices />
            </AppLayout>
          } />
          <Route path="/settings/access-control" element={
            <AppLayout title="Controle de Acesso">
              <AccessControl />
            </AppLayout>
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
  </QueryClientProvider>
);

export default App;
