import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function TopMetrics() {
  const canalAquisicao = [
    { nome: "Google", valor: 24, cor: "#4285F4" },
    { nome: "Indicação", valor: 16, cor: "#00D4AA" },
    { nome: "Facebook", valor: 11, cor: "#1877F2" },
    { nome: "Instagram", valor: 11, cor: "#E4405F" }
  ];

  const performanceSemanal = [
    { semana: "Sem 1", vendas: 12620 },
    { semana: "Sem 2", vendas: 4660 },
    { semana: "Sem 3", vendas: 1280 },
    { semana: "Sem 4", vendas: 17000 }
  ];

  const topTecnicos = [
    { nome: "Bill Gates", eficiencia: 95 },
    { nome: "José Geraldo", eficiencia: 88 },
    { nome: "Jeff Bezos", eficiencia: 91 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Canais de Aquisição */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📈 Top Canais de Aquisição
            </CardTitle>
            <Link to="/gestao-geral">
              <Button variant="outline" size="sm">
                Ver Mais
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {canalAquisicao.slice(0, 4).map((canal, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: canal.cor }}
                  />
                  <span className="font-medium">{canal.nome}</span>
                </div>
                <Badge variant="outline">{canal.valor}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Semanal Resumida */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📊 Performance Semanal
            </CardTitle>
            <Link to="/gestao-geral">
              <Button variant="outline" size="sm">
                Análise Completa
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={performanceSemanal}>
              <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Bar dataKey="vendas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Técnicos */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              🏆 Top Técnicos
            </CardTitle>
            <Link to="/gestao-geral">
              <Button variant="outline" size="sm">
                Rankings Completos
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTecnicos.map((tecnico, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{tecnico.nome}</span>
                </div>
                <Badge className="bg-green-500">{tecnico.eficiencia}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}