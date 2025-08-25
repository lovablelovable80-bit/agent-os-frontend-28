import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Target, 
  Activity,
  Download,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  Zap,
  Award,
  AlertTriangle
} from "lucide-react";

interface ReportMetrics {
  period: string;
  totalServices: number;
  completedServices: number;
  revenue: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  techniciansPerformance: Array<{
    name: string;
    completed: number;
    avgTime: number;
    rating: number;
  }>;
  deviceStats: Array<{
    type: string;
    count: number;
    avgValue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    services: number;
    revenue: number;
  }>;
}

export function AdvancedReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState<any>(null);

  // Mock data para demonstração
  const metrics: ReportMetrics = {
    period: "Últimos 30 dias",
    totalServices: 47,
    completedServices: 38,
    revenue: 15420.50,
    avgResolutionTime: 3.2,
    customerSatisfaction: 4.7,
    techniciansPerformance: [
      { name: "Carlos Santos", completed: 15, avgTime: 2.8, rating: 4.9 },
      { name: "Ana Costa", completed: 12, avgTime: 3.1, rating: 4.8 },
      { name: "João Lima", completed: 11, avgTime: 3.5, rating: 4.6 }
    ],
    deviceStats: [
      { type: "Smartphones", count: 28, avgValue: 280.50 },
      { type: "Laptops", count: 12, avgValue: 650.00 },
      { type: "Tablets", count: 7, avgValue: 390.00 }
    ],
    monthlyTrends: [
      { month: "Jan", services: 32, revenue: 11200 },
      { month: "Fev", services: 28, revenue: 9800 },
      { month: "Mar", services: 35, revenue: 12600 },
      { month: "Abr", services: 42, revenue: 14800 },
      { month: "Mai", services: 47, revenue: 15420 }
    ]
  };

  const completionRate = (metrics.completedServices / metrics.totalServices) * 100;
  const revenueGrowth = 12.5; // Exemplo de crescimento
  const timeEfficiency = metrics.avgResolutionTime <= 3 ? "Excelente" : metrics.avgResolutionTime <= 5 ? "Bom" : "Precisa Melhorar";

  const exportReport = (format: string) => {
    // Lógica de exportação
    console.log(`Exportando relatório em formato ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Controles do Relatório */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Relatórios Avançados
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Período Customizado
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalServices}</p>
                <p className="text-xs text-muted-foreground">Total de OS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+5.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {(metrics.revenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">Receita</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+{revenueGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.avgResolutionTime}</p>
                <p className="text-xs text-muted-foreground">Dias Médios</p>
                <Badge 
                  variant={timeEfficiency === "Excelente" ? "default" : timeEfficiency === "Bom" ? "secondary" : "destructive"}
                  className="text-xs mt-1"
                >
                  {timeEfficiency}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.customerSatisfaction}</p>
                <p className="text-xs text-muted-foreground">Satisfação</p>
                <div className="flex items-center gap-1 mt-1">
                  {"★".repeat(Math.floor(metrics.customerSatisfaction))}
                  <span className="text-xs text-muted-foreground">({metrics.customerSatisfaction}/5)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Detalhados */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="technicians">Técnicos</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: "Concluídos", count: 38, color: "bg-success", percent: 81 },
                    { status: "Em Andamento", count: 6, color: "bg-primary", percent: 13 },
                    { status: "Aguardando", count: 3, color: "bg-warning", percent: 6 }
                  ].map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.status}</span>
                        <span className="font-medium">{item.count} ({item.percent}%)</span>
                      </div>
                      <Progress value={item.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métricas de Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Tempo Médio de Reparo</p>
                      <p className="text-sm text-muted-foreground">Por tipo de dispositivo</p>
                    </div>
                    <Badge variant="outline">{metrics.avgResolutionTime} dias</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { device: "Smartphones", time: 2.1, trend: "down" },
                      { device: "Laptops", time: 4.8, trend: "up" },
                      { device: "Tablets", time: 3.2, trend: "stable" }
                    ].map((item) => (
                      <div key={item.device} className="flex items-center justify-between text-sm">
                        <span>{item.device}</span>
                        <div className="flex items-center gap-2">
                          <span>{item.time} dias</span>
                          {item.trend === "down" && <TrendingDown className="w-3 h-3 text-success" />}
                          {item.trend === "up" && <TrendingUp className="w-3 h-3 text-destructive" />}
                          {item.trend === "stable" && <Activity className="w-3 h-3 text-muted-foreground" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance dos Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.techniciansPerformance.map((tech, index) => (
                  <div key={tech.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                          'bg-gradient-to-r from-amber-600 to-amber-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tech.completed} OS concluídas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {"★".repeat(Math.floor(tech.rating))}
                          <span className="text-sm text-muted-foreground">({tech.rating})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{tech.avgTime} dias médio</p>
                      </div>
                    </div>
                    <Progress value={(tech.completed / 15) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Análise por Dispositivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.deviceStats.map((device) => (
                  <div key={device.type} className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium mb-2">{device.type}</h3>
                    <p className="text-2xl font-bold text-primary">{device.count}</p>
                    <p className="text-sm text-muted-foreground">unidades</p>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm">Ticket Médio</p>
                      <p className="font-medium text-accent">R$ {device.avgValue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tendências Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Volume de Serviços</h4>
                  <div className="space-y-2">
                    {metrics.monthlyTrends.map((month) => (
                      <div key={month.month} className="flex items-center gap-4">
                        <span className="w-8 text-sm">{month.month}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{month.services} OS</span>
                            <span className="text-sm text-muted-foreground">
                              R$ {(month.revenue / 1000).toFixed(1)}k
                            </span>
                          </div>
                          <Progress value={(month.services / 50) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}