import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, Users, Wrench, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InteractiveCharts() {
  const [visibleSeries, setVisibleSeries] = useState({
    vendas: true,
    servicos: true,
    lucro: true
  });

  const [projectionPeriod, setProjectionPeriod] = useState<"semanal" | "mensal" | "anual">("mensal");

  const osPorSemana = [
    { semana: "Sem 1", vendas: 12620, servicos: 8500, lucro: 4120 },
    { semana: "Sem 2", vendas: 4660, servicos: 3200, lucro: 1460 },
    { semana: "Sem 3", vendas: 1280, servicos: 900, lucro: 380 },
    { semana: "Sem 4", vendas: 17000, servicos: 12000, lucro: 5000 },
    { semana: "Sem 5", vendas: 4660, servicos: 3100, lucro: 1560 }
  ];

  const osPorAtendente = [
    { name: "Patricia Abravanel", value: 36.51, color: "#FBBF24", icon: "👩‍💼" },
    { name: "Ana Carla", value: 61.06, color: "#34D399", icon: "👩‍💻" },
    { name: "Sem Técnico", value: 2.43, color: "#60A5FA", icon: "❓" }
  ];

  const tecnicoPerformance = [
    { name: "Bill Gates", eficiencia: 95, satisfacao: 92, os_concluidas: 45 },
    { name: "José Geraldo", eficiencia: 88, satisfacao: 89, os_concluidas: 32 },
    { name: "Jeff Bezos", eficiencia: 91, satisfacao: 85, os_concluidas: 28 },
    { name: "Terceirizado Elon", eficiencia: 82, satisfacao: 78, os_concluidas: 15 },
    { name: "Mark Zuckerberg", eficiencia: 79, satisfacao: 82, os_concluidas: 12 },
    { name: "Ana Carla", eficiencia: 85, satisfacao: 88, os_concluidas: 18 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  };

  const getProjectionData = () => {
    console.log('getProjectionData called with period:', projectionPeriod);
    switch (projectionPeriod) {
      case "semanal":
        return [
          { periodo: "Semana 1", receitaAtual: 45000, projecao: 48000 },
          { periodo: "Semana 2", receitaAtual: 52000, projecao: 55000 },
          { periodo: "Semana 3", receitaAtual: 48000, projecao: 51000 },
          { periodo: "Semana 4", receitaAtual: 0, projecao: 53000 }
        ];
      case "mensal":
        return [
          { periodo: "Jan", receitaAtual: 180000, projecao: 190000 },
          { periodo: "Fev", receitaAtual: 195000, projecao: 205000 },
          { periodo: "Mar", receitaAtual: 210000, projecao: 220000 },
          { periodo: "Abr", receitaAtual: 0, projecao: 235000 },
          { periodo: "Mai", receitaAtual: 0, projecao: 250000 },
          { periodo: "Jun", receitaAtual: 0, projecao: 265000 }
        ];
      case "anual":
        return [
          { periodo: "2022", receitaAtual: 2100000, projecao: 2200000 },
          { periodo: "2023", receitaAtual: 2450000, projecao: 2600000 },
          { periodo: "2024", receitaAtual: 2800000, projecao: 3100000 },
          { periodo: "2025", receitaAtual: 0, projecao: 3500000 }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance por Semana */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Performance Semanal
            </CardTitle>
            <div className="flex gap-2">
              {Object.entries(visibleSeries).map(([key, visible]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSeries(key as keyof typeof visibleSeries)}
                  className="flex items-center gap-1"
                >
                  {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={osPorSemana}>
              <defs>
                <linearGradient id="vendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="servicos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="lucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {visibleSeries.vendas && (
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="url(#vendas)"
                  strokeWidth={2}
                />
              )}
              {visibleSeries.servicos && (
                <Area
                  type="monotone"
                  dataKey="servicos"
                  stackId="1"
                  stroke="#10B981"
                  fill="url(#servicos)"
                  strokeWidth={2}
                />
              )}
              {visibleSeries.lucro && (
                <Area
                  type="monotone"
                  dataKey="lucro"
                  stackId="1"
                  stroke="#F59E0B"
                  fill="url(#lucro)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projeção de Receita */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Projeção de Receita
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={projectionPeriod === "semanal" ? "default" : "outline"}
                size="sm"
                onClick={() => setProjectionPeriod("semanal")}
              >
                Semanal
              </Button>
              <Button
                variant={projectionPeriod === "mensal" ? "default" : "outline"}
                size="sm"
                onClick={() => setProjectionPeriod("mensal")}
              >
                Mensal
              </Button>
              <Button
                variant={projectionPeriod === "anual" ? "default" : "outline"}
                size="sm"
                onClick={() => setProjectionPeriod("anual")}
              >
                Anual
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={getProjectionData()}>
              <defs>
                <linearGradient id="projecao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-semibold">{label}</p>
                        <p style={{ color: "#8B5CF6" }}>
                          Receita Atual: {payload[0]?.value?.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </p>
                        <p style={{ color: "#10B981" }}>
                          Projeção: {payload[1]?.value?.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="receitaAtual"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                name="Receita Atual"
              />
              <Line
                type="monotone"
                dataKey="projecao"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                name="Projeção"
              />
              <Area
                type="monotone"
                dataKey="receitaAtual"
                stroke="none"
                fill="url(#projecao)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Crescimento Previsto</p>
              <p className="text-lg font-semibold text-green-600">+12.5%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Meta Período</p>
              <p className="text-lg font-semibold">R$ 85.000</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Atingimento</p>
              <p className="text-lg font-semibold text-blue-600">88%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Atendente */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Distribuição por Atendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={osPorAtendente}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name.split(" ")[0]}: ${value}%`}
                >
                  {osPorAtendente.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {osPorAtendente.map((item, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.icon} {item.name.split(" ")[0]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance dos Técnicos */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-500" />
              Performance dos Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="eficiencia" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="eficiencia">Eficiência</TabsTrigger>
                <TabsTrigger value="satisfacao">Satisfação</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
              </TabsList>
              
              <TabsContent value="eficiencia">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tecnicoPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="eficiencia" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="satisfacao">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tecnicoPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="satisfacao" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="volume">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tecnicoPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="os_concluidas" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}