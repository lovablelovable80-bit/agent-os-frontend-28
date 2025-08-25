import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Download, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterState {
  period: string;
  status: string[];
  technician: string[];
  department: string;
}

export default function AdvancedFilters() {
  const [filters, setFilters] = useState<FilterState>({
    period: "30days",
    status: [],
    technician: [],
    department: "all"
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const periods = [
    { value: "7days", label: "Últimos 7 dias" },
    { value: "30days", label: "Últimos 30 dias" },
    { value: "90days", label: "Últimos 90 dias" },
    { value: "custom", label: "Período personalizado" }
  ];

  const statusOptions = [
    "Orçamento", "Andamento", "Aberto", "Pausado", "Cancelado", "Concluído", "Faturado"
  ];

  const technicians = [
    "Bill Gates", "José Geraldo", "Jeff Bezos", "Terceirizado Elon", "Mark Zuckerberg", "Ana Carla"
  ];

  const toggleArrayFilter = (array: string[], value: string, setter: (newArray: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const clearFilters = () => {
    setFilters({
      period: "30days",
      status: [],
      technician: [],
      department: "all"
    });
  };

  const activeFiltersCount = filters.status.length + filters.technician.length + 
    (filters.department !== "all" ? 1 : 0);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* Period Selector */}
        <Select 
          value={filters.period} 
          onValueChange={(value) => setFilters({...filters, period: value})}
        >
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map(period => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Filtros Avançados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <Badge
                        key={status}
                        variant={filters.status.includes(status) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter(
                          filters.status, 
                          status, 
                          (newStatus) => setFilters({...filters, status: newStatus})
                        )}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Technician Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Técnicos</label>
                  <div className="flex flex-wrap gap-2">
                    {technicians.map(tech => (
                      <Badge
                        key={tech}
                        variant={filters.technician.includes(tech) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter(
                          filters.technician, 
                          tech, 
                          (newTech) => setFilters({...filters, technician: newTech})
                        )}
                      >
                        {tech.split(" ")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={clearFilters} variant="outline" className="flex-1">
                    Limpar
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)} className="flex-1">
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
}