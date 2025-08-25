import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Eye, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const recentServices = [
  {
    id: "001",
    cliente: "João Silva",
    device: "iPhone 14 Pro",
    problema: "Tela quebrada",
    status: "Em andamento",
    prazo: "2 dias",
    priority: "high"
  },
  {
    id: "002",
    cliente: "Maria Santos",
    device: "Samsung Galaxy S23",
    problema: "Bateria viciada",
    status: "Aguardando peça",
    prazo: "5 dias",
    priority: "normal"
  },
  {
    id: "003",
    cliente: "Carlos Oliveira",
    device: "Xiaomi Mi 11",
    problema: "Não carrega",
    status: "Finalizado",
    prazo: "Entregue",
    priority: "low"
  },
  {
    id: "004",
    cliente: "Ana Costa",
    device: "iPhone 13",
    problema: "Câmera não funciona",
    status: "Diagnóstico",
    prazo: "1 dia",
    priority: "urgent"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Finalizado":
      return <CheckCircle className="w-4 h-4" />;
    case "Em andamento":
      return <Clock className="w-4 h-4" />;
    case "Aguardando peça":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Finalizado":
      return "bg-success/10 text-success border-success/20";
    case "Em andamento":
      return "bg-primary/10 text-primary border-primary/20";
    case "Aguardando peça":
      return "bg-warning/10 text-warning border-warning/20";
    case "Diagnóstico":
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "normal":
      return "bg-primary/10 text-primary border-primary/20";
    case "low":
      return "bg-muted/10 text-muted-foreground border-muted/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

export function RecentServices() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewService = (serviceId: string) => {
    toast({
      title: "Visualizando serviço",
      description: `Abrindo detalhes do serviço #${serviceId}`,
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wrench className="w-5 h-5 text-primary" />
          Serviços Recentes
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/services")}
          className="hover:bg-primary/10"
        >
          Ver Todos
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentServices.map((service) => (
          <div 
            key={service.id}
            className="group p-4 border border-border/50 rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground text-sm">
                    #{service.id}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {service.cliente}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPriorityColor(service.priority)}`}
                  >
                    {service.priority === "urgent" && "Urgente"}
                    {service.priority === "high" && "Alta"}
                    {service.priority === "normal" && "Normal"}
                    {service.priority === "low" && "Baixa"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{service.device}</span> - {service.problema}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right space-y-2">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getStatusColor(service.status)}`}
                  >
                    {getStatusIcon(service.status)}
                    {service.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {service.prazo}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewService(service.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}