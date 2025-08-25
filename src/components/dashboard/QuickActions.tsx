import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, 
  Users, 
  Package, 
  BarChart3,
  Plus,
  Zap
} from "lucide-react";

interface ServiceFormData {
  client: string;
  device: string;
  problem: string;
  description: string;
  priority: string;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newServiceOpen, setNewServiceOpen] = useState(false);
  const [newClientOpen, setNewClientOpen] = useState(false);

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    client: "",
    device: "",
    problem: "",
    description: "",
    priority: "normal"
  });

  const [clientForm, setClientForm] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleNewService = () => {
    toast({
      title: "Serviço criado!",
      description: `Serviço para ${serviceForm.client} foi registrado com sucesso.`,
    });
    setNewServiceOpen(false);
    setServiceForm({
      client: "",
      device: "",
      problem: "",
      description: "",
      priority: "normal"
    });
  };

  const handleNewClient = () => {
    toast({
      title: "Cliente cadastrado!",
      description: `Cliente ${clientForm.name} foi cadastrado com sucesso.`,
    });
    setNewClientOpen(false);
    setClientForm({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  const quickActions = [
    {
      icon: Wrench,
      title: "Novo Serviço",
      description: "Registrar reparo",
      color: "primary",
      action: () => setNewServiceOpen(true)
    },
    {
      icon: Users,
      title: "Novo Cliente",
      description: "Cadastrar cliente",
      color: "accent",
      action: () => setNewClientOpen(true)
    },
    {
      icon: Package,
      title: "Estoque",
      description: "Consultar peças",
      color: "success",
      action: () => navigate("/products")
    },
    {
      icon: BarChart3,
      title: "Relatórios",
      description: "Ver relatórios",
      color: "warning",
      action: () => navigate("/gestao-geral")
    }
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="w-5 h-5 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full p-4 text-left border border-border/50 rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${action.color}/10 text-${action.color} group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </button>
        ))}

        {/* Novo Serviço Dialog */}
        <Dialog open={newServiceOpen} onOpenChange={setNewServiceOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Serviço</DialogTitle>
              <DialogDescription>
                Registrar um novo serviço de reparo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  value={serviceForm.client}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device">Dispositivo</Label>
                <Input
                  id="device"
                  value={serviceForm.device}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, device: e.target.value }))}
                  placeholder="Ex: iPhone 14, Samsung Galaxy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Problema</Label>
                <Input
                  id="problem"
                  value={serviceForm.problem}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, problem: e.target.value }))}
                  placeholder="Ex: Tela quebrada, não liga"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={serviceForm.priority} onValueChange={(value) => setServiceForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalhes adicionais..."
                />
              </div>
              <Button onClick={handleNewService} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Criar Serviço
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Novo Cliente Dialog */}
        <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
              <DialogDescription>
                Cadastrar um novo cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={clientForm.address}
                  onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Endereço completo"
                />
              </div>
              <Button onClick={handleNewClient} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}