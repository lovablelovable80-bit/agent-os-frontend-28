import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  cpf: string;
  name: string;
  email: string;
  phone: string;
}

const services = [
  { id: "1", name: "Reparo de Tela", duration: "1h", price: 150 },
  { id: "2", name: "Troca de Bateria", duration: "30min", price: 80 },
  { id: "3", name: "Manutenção Preventiva", duration: "2h", price: 200 },
  { id: "4", name: "Limpeza Interna", duration: "45min", price: 60 },
  { id: "5", name: "Atualização de Software", duration: "1h", price: 100 },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export default function ClientSchedule() {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if client is authenticated
    const authData = localStorage.getItem('clientAuth');
    if (!authData) {
      navigate('/client-login');
      return;
    }

    setClientData(JSON.parse(authData));
  }, [navigate]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedService || !selectedTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate scheduling process
    setTimeout(() => {
      const selectedServiceData = services.find(s => s.id === selectedService);
      
      // Store appointment in localStorage (simulate database)
      const appointments = JSON.parse(localStorage.getItem('clientAppointments') || '[]');
      const newAppointment = {
        id: Date.now().toString(),
        clientCpf: clientData?.cpf,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        service: selectedServiceData?.name,
        description,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      appointments.push(newAppointment);
      localStorage.setItem('clientAppointments', JSON.stringify(appointments));

      toast({
        title: "Agendamento realizado!",
        description: `Seu serviço foi agendado para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedService("");
      setSelectedTime("");
      setDescription("");
      setIsLoading(false);

      // Navigate back to profile after a delay
      setTimeout(() => {
        navigate('/client-profile');
      }, 2000);
    }, 1000);
  };

  const getSelectedServiceData = () => {
    return services.find(s => s.id === selectedService);
  };

  if (!clientData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/client-profile')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Agendar Serviço</h1>
            <p className="text-muted-foreground">Escolha o melhor horário para seu atendimento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scheduling Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Novo Agendamento
                </CardTitle>
                <CardDescription>
                  Preencha as informações para agendar seu serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSchedule} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label>Tipo de Serviço *</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex justify-between w-full">
                              <span>{service.name}</span>
                              <span className="text-muted-foreground ml-4">
                                R$ {service.price} - {service.duration}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Data *</Label>
                    <div className="border rounded-lg p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label>Horário *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Problema (Opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o problema ou observações adicionais..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Agendando..." : "Confirmar Agendamento"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{clientData.name}</p>
                  <p className="text-sm text-muted-foreground">{clientData.cpf}</p>
                </div>

                {selectedService && (
                  <div>
                    <Label className="text-sm font-medium">Serviço</Label>
                    <p className="text-sm text-muted-foreground">
                      {getSelectedServiceData()?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      R$ {getSelectedServiceData()?.price} - {getSelectedServiceData()?.duration}
                    </p>
                  </div>
                )}

                {selectedDate && (
                  <div>
                    <Label className="text-sm font-medium">Data</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                {selectedTime && (
                  <div>
                    <Label className="text-sm font-medium">Horário</Label>
                    <p className="text-sm text-muted-foreground">{selectedTime}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Importante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Chegue 15 minutos antes do horário agendado</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Traga um documento de identificação</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Para cancelamentos, avise com 24h de antecedência</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}