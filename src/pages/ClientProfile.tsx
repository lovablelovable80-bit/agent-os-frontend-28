import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ShoppingBag, Wrench, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  loginTime: string;
}

interface Purchase {
  id: string;
  date: string;
  type: 'product' | 'service';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function ClientProfile() {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data for purchases and services
  const mockPurchases: Purchase[] = [
    {
      id: "1",
      date: "2024-01-15",
      type: "product",
      description: "Smartphone Galaxy S24",
      amount: 2499.99,
      status: "completed"
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "service",
      description: "Reparo de tela - iPhone 13",
      amount: 299.99,
      status: "completed"
    },
    {
      id: "3",
      date: "2024-01-08",
      type: "product",
      description: "Carregador USB-C",
      amount: 49.99,
      status: "pending"
    }
  ];

  const mockAppointments: Appointment[] = [
    {
      id: "1",
      date: "2024-02-01",
      time: "14:00",
      service: "Manutenção preventiva",
      status: "scheduled"
    },
    {
      id: "2",
      date: "2024-01-20",
      time: "10:30",
      service: "Troca de bateria",
      status: "completed"
    }
  ];

  useEffect(() => {
    // Check if client is authenticated
    const authData = localStorage.getItem('clientAuth');
    if (!authData) {
      navigate('/client-login');
      return;
    }

    setClientData(JSON.parse(authData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientAuth');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate('/client-login');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
      scheduled: "outline"
    } as const;

    const labels = {
      completed: "Concluído",
      pending: "Pendente",
      cancelled: "Cancelado",
      scheduled: "Agendado"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (!clientData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Olá, {clientData.name}!</h1>
              <p className="text-muted-foreground">CPF: {clientData.cpf}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{clientData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{clientData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">São Paulo, SP</span>
                </div>
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/client-schedule')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Serviço
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ver Produtos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Histórico</TabsTrigger>
                <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Histórico de Compras e Serviços
                    </CardTitle>
                    <CardDescription>
                      Veja todas suas transações e serviços realizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPurchases.map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              {purchase.type === 'product' ? (
                                <ShoppingBag className="w-5 h-5" />
                              ) : (
                                <Wrench className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{purchase.description}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(purchase.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              R$ {purchase.amount.toFixed(2).replace('.', ',')}
                            </p>
                            {getStatusBadge(purchase.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Meus Agendamentos
                    </CardTitle>
                    <CardDescription>
                      Gerencie seus agendamentos de serviços
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{appointment.service}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(appointment.status)}
                            {appointment.status === 'scheduled' && (
                              <div className="mt-2">
                                <Button variant="outline" size="sm">
                                  Reagendar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button 
                        className="w-full"
                        onClick={() => navigate('/client-schedule')}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Novo Agendamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}