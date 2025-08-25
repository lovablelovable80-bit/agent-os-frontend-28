import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

const stats = [
  {
    title: "Faturamento Mensal",
    value: "R$ 47.580",
    change: "+12%",
    icon: DollarSign,
    color: "success",
    route: "/pos"
  },
  {
    title: "Clientes Ativos",
    value: "1.247",
    change: "+5%",
    icon: Users,
    color: "primary",
    route: "/customers"
  },
  {
    title: "Serviços Concluídos",
    value: "89",
    change: "+23%",
    icon: CheckCircle,
    color: "success",
    route: "/services"
  },
  {
    title: "Serviços Pendentes",
    value: "12",
    change: "-8%",
    icon: Clock,
    color: "warning",
    route: "/services"
  }
];

export function StatsCards() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20" 
          onClick={() => navigate(stat.route)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <div className={`text-sm flex items-center gap-1 ${
                  stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.change} vs mês anterior
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}