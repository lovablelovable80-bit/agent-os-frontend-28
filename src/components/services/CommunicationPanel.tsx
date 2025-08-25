import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Phone, 
  Mail, 
  MessageSquare, 
  Paperclip, 
  Smile,
  Clock,
  CheckCircle2,
  User,
  Smartphone
} from "lucide-react";

interface CommunicationPanelProps {
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export function CommunicationPanel({ 
  serviceId, 
  customerName, 
  customerPhone, 
  customerEmail 
}: CommunicationPanelProps) {
  const [message, setMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState<"sms" | "email" | "whatsapp">("whatsapp");
  const { toast } = useToast();

  const [communications] = useState([
    {
      id: 1,
      type: "whatsapp",
      direction: "sent",
      message: "Olá! Recebemos seu dispositivo para reparo. Em breve enviaremos o diagnóstico.",
      timestamp: "10:30",
      status: "read",
      sender: "Sistema"
    },
    {
      id: 2,
      type: "whatsapp", 
      direction: "received",
      message: "Obrigado! Quanto tempo demora normalmente?",
      timestamp: "10:35",
      status: "received",
      sender: customerName
    },
    {
      id: 3,
      type: "whatsapp",
      direction: "sent", 
      message: "Para este tipo de reparo, normalmente levamos de 2 a 3 dias úteis. Te mantemos informado!",
      timestamp: "10:40",
      status: "delivered",
      sender: "Carlos Santos"
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    toast({
      title: "Mensagem Enviada",
      description: `Mensagem enviada via ${activeChannel.toUpperCase()} para ${customerName}`,
    });

    setMessage("");
  };

  const handleQuickAction = (action: string) => {
    const quickMessages = {
      diagnosis: "Diagnóstico concluído! Seu dispositivo apresenta os seguintes problemas. Enviaremos o orçamento em breve.",
      ready: "Seu dispositivo está pronto para retirada! Funcionamento em horário comercial.",
      parts: "Aguardando chegada de peças. Previsão de 2-3 dias úteis. Te avisamos assim que chegarem!",
      delay: "Precisamos de mais um tempinho para seu reparo. Novo prazo estimado: [data]. Obrigado pela paciência!"
    };

    setMessage(quickMessages[action as keyof typeof quickMessages] || "");
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp": return <MessageSquare className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "sms": return <Smartphone className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read": return <CheckCircle2 className="w-3 h-3 text-primary" />;
      case "delivered": return <CheckCircle2 className="w-3 h-3 text-muted-foreground" />;
      case "sent": return <Clock className="w-3 h-3 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comunicação com Cliente
          </div>
          <div className="flex gap-1">
            <Button
              variant={activeChannel === "whatsapp" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChannel("whatsapp")}
              className="text-xs"
            >
              WhatsApp
            </Button>
            <Button
              variant={activeChannel === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChannel("email")}
              className="text-xs"
            >
              E-mail
            </Button>
            <Button
              variant={activeChannel === "sms" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChannel("sms")}
              className="text-xs"
            >
              SMS
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 p-4 pt-0">
        {/* Customer Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">{customerName}</p>
            <p className="text-xs text-muted-foreground">
              {activeChannel === "email" ? customerEmail : customerPhone}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            OS #{serviceId}
          </Badge>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 border rounded-lg p-3">
          <div className="space-y-3">
            {communications.map((comm) => (
              <div
                key={comm.id}
                className={`flex ${comm.direction === "sent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    comm.direction === "sent"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{comm.message}</p>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-xs opacity-70">{comm.timestamp}</span>
                    <div className="flex items-center gap-1">
                      {getChannelIcon(comm.type)}
                      {comm.direction === "sent" && getStatusIcon(comm.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("diagnosis")}
            className="text-xs"
          >
            📋 Diagnóstico
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("ready")}
            className="text-xs"
          >
            ✅ Pronto
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("parts")}
            className="text-xs"
          >
            📦 Aguardando Peças
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("delay")}
            className="text-xs"
          >
            ⏰ Atraso
          </Button>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Textarea
            placeholder={`Digite sua mensagem para envio via ${activeChannel.toUpperCase()}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="bg-gradient-primary"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}