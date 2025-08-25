import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OSStatus {
  name: string;
  value: number;
  color: string;
  description: string;
}

export default function OSStatusCircles() {
  const [selectedStatus, setSelectedStatus] = useState<OSStatus | null>(null);
  
  const osStatusData: OSStatus[] = [
    { name: "Orçamento", value: 60, color: "#60A5FA", description: "Aguardando aprovação do cliente" },
    { name: "Andamento", value: 9, color: "#34D399", description: "Em execução pelos técnicos" },
    { name: "Aberto", value: 27, color: "#FBBF24", description: "Aguardando início dos trabalhos" },
    { name: "Pausado", value: 2, color: "#F87171", description: "Temporariamente suspenso" },
    { name: "Cancelado", value: 17, color: "#94A3B8", description: "Cancelado pelo cliente ou empresa" },
    { name: "Concluído", value: 26, color: "#A78BFA", description: "Trabalho finalizado com sucesso" },
    { name: "Faturado", value: 98, color: "#FB923C", description: "Já faturado e cobrado" }
  ];

  const total = osStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Status Circles */}
      <div className="grid grid-cols-7 gap-2">
        {osStatusData.map((item, index) => (
          <div 
            key={index} 
            className="text-center cursor-pointer transition-all duration-300 hover:scale-110"
            onClick={() => setSelectedStatus(item)}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-1 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: item.color,
                boxShadow: selectedStatus?.name === item.name ? `0 0 20px ${item.color}` : undefined
              }}
            >
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Status Details */}
      {selectedStatus && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedStatus.color }}
              />
              {selectedStatus.name}
              <Badge variant="outline">{selectedStatus.value} O.S</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{selectedStatus.description}</p>
            <div className="flex justify-between text-sm">
              <span>Percentual do total:</span>
              <span className="font-semibold">{((selectedStatus.value / total) * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}