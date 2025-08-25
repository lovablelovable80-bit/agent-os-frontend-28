import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Check, BarChart3, Users, ShoppingCart, FileText, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    description: "Visualize todos os dados importantes do seu negócio em tempo real"
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Organize e acompanhe todos os seus clientes de forma eficiente"
  },
  {
    icon: ShoppingCart,
    title: "PDV Integrado",
    description: "Sistema de vendas completo com controle de estoque"
  },
  {
    icon: FileText,
    title: "Documentos Automáticos",
    description: "Gere relatórios e documentos de forma automática"
  }
];

const benefits = [
  "Interface intuitiva e fácil de usar",
  "Relatórios detalhados em tempo real",
  "Suporte técnico especializado",
  "Backup automático dos dados",
  "Acesso de qualquer dispositivo",
  "Atualizações constantes"
];

export default function Sales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BusinessPro</span>
          </div>
          <Button onClick={() => navigate('/login')} variant="outline">
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            Sistema Completo de Gestão
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Transforme Seu Negócio
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A solução completa para gerenciar clientes, vendas, produtos e serviços. 
            Tudo que você precisa em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="text-lg px-8"
            >
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que Você Precisa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades poderosas para impulsionar seu negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Por Que Escolher o BusinessPro?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Mais de 10.000 empresas já confiam em nossa plataforma para 
                gerenciar seus negócios de forma eficiente e segura.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="p-1 bg-success/20 rounded-full">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">Dashboard Interativo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a milhares de empresas que já transformaram seus negócios
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="text-lg px-8"
              >
                <Shield className="w-5 h-5 mr-2" />
                Acesso Seguro
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Teste grátis por 7 dias • Sem compromisso • Suporte incluído
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 BusinessPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}