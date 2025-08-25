import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  permissions: string[];
  lastAccess: string;
}

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    role: "admin",
    status: "active",
    permissions: ["dashboard", "services", "customers", "settings"],
    lastAccess: "2024-01-15 14:30"
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@empresa.com", 
    role: "tecnico",
    status: "active",
    permissions: ["dashboard", "services", "customers"],
    lastAccess: "2024-01-15 10:15"
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@empresa.com",
    role: "atendente",
    status: "inactive",
    permissions: ["dashboard", "customers"],
    lastAccess: "2024-01-10 16:45"
  }
];

const roles = [
  { value: "admin", label: "Administrador", description: "Acesso total ao sistema" },
  { value: "tecnico", label: "Técnico", description: "Acesso a serviços e clientes" },
  { value: "atendente", label: "Atendente", description: "Acesso limitado a atendimento" },
  { value: "vendedor", label: "Vendedor", description: "Acesso a PDV e vendas" }
];

const permissions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "services", label: "Serviços" },
  { id: "pos", label: "PDV" },
  { id: "customers", label: "Clientes" },
  { id: "products", label: "Produtos" },
  { id: "reports", label: "Relatórios" },
  { id: "settings", label: "Configurações" }
];

export default function AccessControl() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);

  const handleStatusToggle = (id: string) => {
    setCollaborators(prev =>
      prev.map(collab =>
        collab.id === id
          ? { ...collab, status: collab.status === "active" ? "inactive" : "active" }
          : collab
      )
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <UserX className="w-3 h-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Admin", className: "bg-purple-100 text-purple-800" },
      tecnico: { label: "Técnico", className: "bg-blue-100 text-blue-800" },
      atendente: { label: "Atendente", className: "bg-green-100 text-green-800" },
      vendedor: { label: "Vendedor", className: "bg-orange-100 text-orange-800" }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, className: "bg-gray-100 text-gray-800" };
    
    return (
      <Badge variant="secondary" className={config.className}>
        <Shield className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <PageContainer
      title="Controle de Acesso"
      description="Gerencie colaboradores e suas permissões no sistema"
      action={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCollaborator ? "Editar Colaborador" : "Novo Colaborador"}
              </DialogTitle>
              <DialogDescription>
                Configure os dados e permissões do colaborador
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@empresa.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Switch id={permission.id} />
                      <Label htmlFor={permission.id} className="text-sm">
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                {editingCollaborator ? "Salvar Alterações" : "Criar Colaborador"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborators.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {collaborators.filter(c => c.status === "active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inativos</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {collaborators.filter(c => c.status === "inactive").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {collaborators.filter(c => c.role === "admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores</CardTitle>
            <CardDescription>
              Lista de todos os colaboradores e suas permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborators.map((collaborator) => (
                  <TableRow key={collaborator.id}>
                    <TableCell className="font-medium">{collaborator.name}</TableCell>
                    <TableCell>{collaborator.email}</TableCell>
                    <TableCell>{getRoleBadge(collaborator.role)}</TableCell>
                    <TableCell>{getStatusBadge(collaborator.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {collaborator.lastAccess}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={collaborator.status === "active"}
                          onCheckedChange={() => handleStatusToggle(collaborator.id)}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            setEditingCollaborator(collaborator);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}