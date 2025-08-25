import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  HelpCircle
} from "lucide-react";

interface ImportedCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  company?: string;
  status?: 'valid' | 'error' | 'warning';
  errors?: string[];
  warnings?: string[];
  lineNumber: number;
}

interface ImportResult {
  total: number;
  valid: number;
  errors: number;
  warnings: number;
  customers: ImportedCustomer[];
}

interface BulkImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (customers: ImportedCustomer[]) => void;
}

export function BulkImport({ open, onOpenChange, onImportComplete }: BulkImportProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ImportedCustomer[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de telefone brasileiro
  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  // Processa CSV/Excel (simulado)
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    return new Promise<ImportResult>((resolve) => {
      setTimeout(() => {
        // Simula processamento de arquivo
        const mockData: ImportedCustomer[] = [
          {
            name: "João Silva Santos",
            email: "joao.silva@email.com",
            phone: "(11) 99999-9999",
            address: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            company: "Empresa ABC",
            status: 'valid',
            lineNumber: 2
          },
          {
            name: "Maria",
            email: "maria-invalid-email",
            phone: "11999999999",
            address: "Av. Paulista, 456",
            city: "São Paulo", 
            state: "SP",
            status: 'error',
            errors: ["Nome muito curto", "Email inválido"],
            lineNumber: 3
          },
          {
            name: "Pedro Oliveira Costa",
            email: "pedro.oliveira@email.com",
            phone: "11888888888",
            company: "Consultoria XYZ",
            status: 'warning',
            warnings: ["Endereço não informado"],
            lineNumber: 4
          },
          {
            name: "Ana Costa Silva",
            email: "ana.costa@email.com",
            phone: "(11) 77777-7777",
            address: "Rua Oscar Freire, 321",
            city: "São Paulo",
            state: "SP",
            company: "Premium S.A.",
            status: 'valid',
            lineNumber: 5
          },
          {
            name: "",
            email: "carlos@email.com",
            phone: "invalid-phone",
            status: 'error',
            errors: ["Nome obrigatório", "Telefone inválido"],
            lineNumber: 6
          }
        ];

        // Simula validação
        mockData.forEach(customer => {
          const errors: string[] = [];
          const warnings: string[] = [];

          // Validações obrigatórias
          if (!customer.name || customer.name.trim().length < 2) {
            errors.push("Nome é obrigatório e deve ter pelo menos 2 caracteres");
          }
          if (!customer.email || !isValidEmail(customer.email)) {
            errors.push("Email inválido");
          }
          if (!customer.phone || !isValidPhone(customer.phone)) {
            errors.push("Telefone inválido");
          }

          // Validações de aviso
          if (!customer.address) {
            warnings.push("Endereço não informado");
          }
          if (!customer.company) {
            warnings.push("Empresa não informada");
          }

          customer.errors = errors;
          customer.warnings = warnings;
          
          if (errors.length > 0) {
            customer.status = 'error';
          } else if (warnings.length > 0) {
            customer.status = 'warning';
          } else {
            customer.status = 'valid';
          }
        });

        const result: ImportResult = {
          total: mockData.length,
          valid: mockData.filter(c => c.status === 'valid').length,
          errors: mockData.filter(c => c.status === 'error').length,
          warnings: mockData.filter(c => c.status === 'warning').length,
          customers: mockData
        };

        setImportResult(result);
        setPreviewData(mockData);
        setIsProcessing(false);
        resolve(result);
      }, 2000);
    });
  }, []);

  // Handle drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Arquivo não suportado",
        description: "Por favor, selecione um arquivo CSV ou Excel (.xlsx, .xls)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    await processFile(file);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Nome,Email,Telefone,Endereço,Cidade,Estado,Empresa\n" +
      "João Silva,joao.silva@email.com,(11) 99999-9999,Rua das Flores 123,São Paulo,SP,Empresa ABC\n" +
      "Maria Santos,maria.santos@email.com,(11) 88888-8888,Av. Paulista 456,São Paulo,SP,\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modelo_importacao_clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template baixado",
      description: "Use este arquivo como modelo para importar seus clientes.",
    });
  };

  const handleImport = () => {
    if (!importResult) return;
    
    const validCustomers = importResult.customers.filter(c => c.status === 'valid' || c.status === 'warning');
    onImportComplete(validCustomers);
    
    toast({
      title: "Importação concluída",
      description: `${validCustomers.length} clientes importados com sucesso.`,
    });
    
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setSelectedFile(null);
    setImportResult(null);
    setPreviewData([]);
    setShowPreview(false);
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid': return <Badge className="bg-green-100 text-green-800">Válido</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Importação em Massa de Clientes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instruções e Template */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Como importar seus clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>1. Baixe o modelo CSV e preencha com os dados dos seus clientes</p>
                <p>2. Campos obrigatórios: Nome, Email e Telefone</p>
                <p>3. Formatos aceitos: CSV, Excel (.xlsx, .xls)</p>
                <p>4. Tamanho máximo: 5MB</p>
              </div>
              <Button variant="outline" onClick={downloadTemplate} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Baixar Modelo CSV
              </Button>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-muted rounded-full">
                    <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                  </div>
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        Arraste seu arquivo aqui ou clique para selecionar
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CSV, Excel (.xlsx, .xls) até 5MB
                      </p>
                    </div>
                  )}
                  
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {selectedFile ? "Trocar Arquivo" : "Selecionar Arquivo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing */}
          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Processando arquivo...</p>
                    <p className="text-sm text-muted-foreground">
                      Validando dados e verificando duplicatas
                    </p>
                  </div>
                </div>
                <Progress value={65} className="mt-3" />
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {importResult && !isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resultado da Validação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{importResult.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.valid}</div>
                    <div className="text-sm text-green-600">Válidos</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{importResult.warnings}</div>
                    <div className="text-sm text-yellow-600">Avisos</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.errors}</div>
                    <div className="text-sm text-red-600">Erros</div>
                  </div>
                </div>

                {importResult.errors > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {importResult.errors} registro(s) contêm erros e não serão importados. 
                      Clique em "Ver Detalhes" para revisar.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={importResult.valid + importResult.warnings === 0}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar {importResult.valid + importResult.warnings} Cliente(s)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Dialog */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Pré-visualização dos Dados</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Linha</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Problemas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(customer.status!)}
                            {getStatusBadge(customer.status!)}
                          </div>
                        </TableCell>
                        <TableCell>{customer.lineNumber}</TableCell>
                        <TableCell className="font-medium">{customer.name || '-'}</TableCell>
                        <TableCell>{customer.email || '-'}</TableCell>
                        <TableCell>{customer.phone || '-'}</TableCell>
                        <TableCell>{customer.company || '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {customer.errors?.map((error, i) => (
                              <div key={i} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                {error}
                              </div>
                            ))}
                            {customer.warnings?.map((warning, i) => (
                              <div key={i} className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                {warning}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}