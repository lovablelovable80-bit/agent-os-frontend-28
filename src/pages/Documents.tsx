import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Filter,
  Calendar,
  User,
  FolderOpen,
  File,
  Image,
  Archive
} from "lucide-react";

// Mock data
const documents = [
  {
    id: 1,
    name: "Contrato de Serviço - Cliente ABC",
    type: "pdf",
    category: "Contratos",
    size: "2.4 MB",
    createdAt: "2024-01-20",
    createdBy: "João Silva",
    tags: ["contrato", "cliente", "abc"]
  },
  {
    id: 2,
    name: "Orçamento Reparo Smartphone",
    type: "pdf",
    category: "Orçamentos",
    size: "856 KB",
    createdAt: "2024-01-19",
    createdBy: "Maria Santos",
    tags: ["orçamento", "smartphone", "reparo"]
  },
  {
    id: 3,
    name: "Manual Técnico - iPhone 15",
    type: "pdf",
    category: "Manuais",
    size: "5.2 MB",
    createdAt: "2024-01-18",
    createdBy: "Carlos Tech",
    tags: ["manual", "iphone", "técnico"]
  },
  {
    id: 4,
    name: "Foto Diagnóstico - Tela Quebrada",
    type: "image",
    category: "Diagnósticos",
    size: "1.8 MB",
    createdAt: "2024-01-17",
    createdBy: "Ana Costa",
    tags: ["diagnóstico", "tela", "foto"]
  },
  {
    id: 5,
    name: "Relatório Mensal - Janeiro",
    type: "excel",
    category: "Relatórios",
    size: "976 KB",
    createdAt: "2024-01-16",
    createdBy: "João Silva",
    tags: ["relatório", "mensal", "janeiro"]
  }
];

const categories = [
  { name: "Contratos", count: 12, icon: FileText },
  { name: "Orçamentos", count: 28, icon: File },
  { name: "Manuais", count: 15, icon: FolderOpen },
  { name: "Diagnósticos", count: 34, icon: Image },
  { name: "Relatórios", count: 8, icon: Archive }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf": return FileText;
    case "image": return Image;
    case "excel": return Archive;
    default: return File;
  }
};

const getFileTypeColor = (type: string) => {
  switch (type) {
    case "pdf": return "bg-red-100 text-red-800";
    case "image": return "bg-green-100 text-green-800";
    case "excel": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function Documents() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentsList, setDocumentsList] = useState(documents);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "pdf",
    tags: "",
    description: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newDocument = {
      id: documentsList.length + 1,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      size: "0 KB",
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: "Usuário Atual",
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    setDocumentsList(prev => [newDocument, ...prev]);
    setFormData({
      name: "",
      category: "",
      type: "pdf",
      tags: "",
      description: ""
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso!",
      description: "Documento criado com sucesso.",
    });
  };

  const handleViewDocument = (doc: any) => {
    toast({
      title: "Visualizando documento",
      description: `Abrindo: ${doc.name}`,
    });
    // Simula abertura do documento
    console.log("Visualizando documento:", doc);
  };

  const handleDownloadDocument = (doc: any) => {
    toast({
      title: "Download iniciado",
      description: `Baixando: ${doc.name} (${doc.size})`,
    });
    // Simula download do documento
    console.log("Baixando documento:", doc);
  };

  const handleDeleteDocument = (docId: number) => {
    setDocumentsList(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Documento excluído",
      description: "Documento removido com sucesso.",
      variant: "destructive"
    });
  };

  const filteredDocuments = documentsList.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer 
      title="Documentos" 
      description="Central de documentos e relatórios"
      action={
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Documento</DialogTitle>
                <DialogDescription>
                  Preencha as informações para criar um novo documento.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Documento *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Nome do documento"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Arquivo</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="image">Imagem</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descrição opcional do documento..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Documento
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="categories">Por Categoria</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type);
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium">{doc.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {doc.createdAt}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {doc.createdBy}
                              </span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getFileTypeColor(doc.type)}>
                            {doc.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{doc.category}</Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDocument(doc)}
                              title="Visualizar documento"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadDocument(doc)}
                              title="Baixar documento"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteDocument(doc.id)}
                              title="Excluir documento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <category.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription>{category.count} documentos</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {documents
                        .filter(doc => doc.category === category.name)
                        .slice(0, 3)
                        .map((doc) => (
                          <div key={doc.id} className="flex items-center gap-2 text-sm">
                            <File className="w-3 h-3 text-muted-foreground" />
                            <span className="truncate">{doc.name}</span>
                          </div>
                        ))}
                      {documents.filter(doc => doc.category === category.name).length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{documents.filter(doc => doc.category === category.name).length - 3} mais...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4">
              {documents
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  return (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">{doc.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Criado em {doc.createdAt}</span>
                                <span>por {doc.createdBy}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getFileTypeColor(doc.type)}>
                              {doc.type.toUpperCase()}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument(doc)}
                            >
                              Abrir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}