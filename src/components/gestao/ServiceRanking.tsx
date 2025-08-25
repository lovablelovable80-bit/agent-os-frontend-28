import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function ServiceRanking() {
  const rankingServicos = [
    {
      posicao: 1,
      servico: "Manutenção Preventiva",
      quantidade: 89,
      valor: "R$ 45.2K",
      tempoMedio: "2.1 dias",
      satisfacao: 98,
      trend: 15.3,
      icon: "🔧"
    },
    {
      posicao: 2,
      servico: "Reparo de Componentes",
      quantidade: 67,
      valor: "R$ 38.7K", 
      tempoMedio: "3.2 dias",
      satisfacao: 95,
      trend: 8.7,
      icon: "⚙️"
    },
    {
      posicao: 3,
      servico: "Instalação de Equipamentos",
      quantidade: 45,
      valor: "R$ 28.1K",
      tempoMedio: "4.5 dias", 
      satisfacao: 92,
      trend: -2.1,
      icon: "🛠️"
    },
    {
      posicao: 4,
      servico: "Diagnóstico Técnico",
      quantidade: 123,
      valor: "R$ 15.8K",
      tempoMedio: "0.8 dias",
      satisfacao: 89,
      trend: 22.4,
      icon: "🔍"
    },
    {
      posicao: 5,
      servico: "Atualização de Software",
      quantidade: 78,
      valor: "R$ 12.3K",
      tempoMedio: "1.2 dias",
      satisfacao: 94,
      trend: 18.9,
      icon: "💻"
    }
  ];

  const tecnicosTop = [
    {
      posicao: 1,
      nome: "Bill Gates",
      servicos: 45,
      tempoMedio: "2.8 dias",
      satisfacao: 97,
      especialidade: "Hardware",
      badge: "🏆 Expert"
    },
    {
      posicao: 2,
      nome: "José Geraldo", 
      servicos: 32,
      tempoMedio: "3.1 dias",
      satisfacao: 94,
      especialidade: "Software",
      badge: "🥈 Senior"
    },
    {
      posicao: 3,
      nome: "Jeff Bezos",
      servicos: 28,
      tempoMedio: "3.5 dias",
      satisfacao: 91,
      especialidade: "Redes",
      badge: "🥉 Pleno"
    }
  ];

  const getPosicaoIcon = (pos: number) => {
    switch(pos) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPosicaoColor = (pos: number) => {
    switch(pos) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30";
      default: return "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Ranking de Serviços */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            🏆 Ranking de Serviços Mais Realizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankingServicos.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${getPosicaoColor(item.posicao)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getPosicaoIcon(item.posicao)}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold">{item.servico}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantidade} serviços realizados
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={item.trend > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                    {item.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(item.trend)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-bold text-green-500">{item.valor}</div>
                    <div className="text-xs text-muted-foreground">Faturamento</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-bold text-blue-500">{item.tempoMedio}</div>
                    <div className="text-xs text-muted-foreground">Tempo Médio</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-bold text-purple-500">{item.satisfacao}%</div>
                    <div className="text-xs text-muted-foreground">Satisfação</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Técnicos */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            🌟 Top Técnicos Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tecnicosTop.map((tecnico, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${getPosicaoColor(tecnico.posicao)}`}
              >
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    {getPosicaoIcon(tecnico.posicao)}
                    <span className="text-lg font-bold">#{tecnico.posicao}</span>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-lg">{tecnico.nome}</div>
                    <Badge className="mt-1">{tecnico.badge}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="font-bold text-blue-500">{tecnico.servicos}</div>
                      <div className="text-xs text-muted-foreground">Serviços</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-orange-500">{tecnico.tempoMedio}</div>
                        <div className="text-muted-foreground">Tempo Médio</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-500">{tecnico.satisfacao}%</div>
                        <div className="text-muted-foreground">Satisfação</div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {tecnico.especialidade}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}