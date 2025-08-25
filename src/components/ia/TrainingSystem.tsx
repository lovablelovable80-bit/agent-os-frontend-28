import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  BookOpen, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from "lucide-react";

interface TrainingExample {
  id: string;
  pergunta: string;
  resposta_ideal: string;
  resposta_atual?: string;
  categoria: string;
  qualidade_resposta?: 'boa' | 'media' | 'ruim';
  feedback?: string;
  criado_em: Date;
}

interface KnowledgeBase {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  tags: string[];
  ativo: boolean;
  criado_em: Date;
}

export function TrainingSystem() {
  const [exemplos, setExemplos] = useState<TrainingExample[]>([
    {
      id: '1',
      pergunta: 'Como gerar um relatório de vendas?',
      resposta_ideal: 'Para gerar um relatório de vendas, você pode usar o comando "Gerar relatório de vendas" e especificar o período desejado.',
      resposta_atual: 'Use o sistema de relatórios para ver as vendas.',
      categoria: 'Relatórios',
      qualidade_resposta: 'media',
      feedback: 'Resposta muito genérica, precisa ser mais específica',
      criado_em: new Date()
    }
  ]);

  const [baseConhecimento, setBaseConhecimento] = useState<KnowledgeBase[]>([
    {
      id: '1',
      titulo: 'Processo de Vendas',
      conteudo: 'O processo de vendas da empresa segue as etapas: Prospecção -> Qualificação -> Proposta -> Negociação -> Fechamento -> Pós-venda.',
      categoria: 'Vendas',
      tags: ['vendas', 'processo', 'pipeline'],
      ativo: true,
      criado_em: new Date()
    }
  ]);

  const [novoExemplo, setNovoExemplo] = useState({
    pergunta: '',
    resposta_ideal: '',
    categoria: ''
  });

  const [novaBase, setNovaBase] = useState({
    titulo: '',
    conteudo: '',
    categoria: '',
    tags: ''
  });

  const categorias = ['Relatórios', 'Vendas', 'Clientes', 'Produtos', 'Financeiro', 'Geral'];

  const adicionarExemplo = () => {
    if (novoExemplo.pergunta && novoExemplo.resposta_ideal) {
      const exemplo: TrainingExample = {
        id: Date.now().toString(),
        pergunta: novoExemplo.pergunta,
        resposta_ideal: novoExemplo.resposta_ideal,
        categoria: novoExemplo.categoria || 'Geral',
        criado_em: new Date()
      };
      
      setExemplos(prev => [...prev, exemplo]);
      setNovoExemplo({ pergunta: '', resposta_ideal: '', categoria: '' });
    }
  };

  const adicionarBaseConhecimento = () => {
    if (novaBase.titulo && novaBase.conteudo) {
      const base: KnowledgeBase = {
        id: Date.now().toString(),
        titulo: novaBase.titulo,
        conteudo: novaBase.conteudo,
        categoria: novaBase.categoria || 'Geral',
        tags: novaBase.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        ativo: true,
        criado_em: new Date()
      };
      
      setBaseConhecimento(prev => [...prev, base]);
      setNovaBase({ titulo: '', conteudo: '', categoria: '', tags: '' });
    }
  };

  const getBadgeColor = (qualidade?: string) => {
    switch (qualidade) {
      case 'boa': return 'default';
      case 'media': return 'secondary';
      case 'ruim': return 'destructive';
      default: return 'outline';
    }
  };

  const estatisticas = {
    total_exemplos: exemplos.length,
    exemplos_bons: exemplos.filter(e => e.qualidade_resposta === 'boa').length,
    exemplos_medios: exemplos.filter(e => e.qualidade_resposta === 'media').length,
    exemplos_ruins: exemplos.filter(e => e.qualidade_resposta === 'ruim').length,
    base_conhecimento: baseConhecimento.filter(b => b.ativo).length
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas do Treinamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Exemplos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total_exemplos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respostas Boas</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.exemplos_bons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respostas Médias</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.exemplos_medios}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respostas Ruins</CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.exemplos_ruins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Conhecimento</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.base_conhecimento}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exemplos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exemplos">Exemplos de Treinamento</TabsTrigger>
          <TabsTrigger value="conhecimento">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="import-export">Importar/Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="exemplos" className="space-y-6">
          {/* Adicionar Novo Exemplo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Exemplo de Treinamento
              </CardTitle>
              <CardDescription>
                Adicione exemplos de perguntas e respostas ideais para treinar a IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pergunta">Pergunta</Label>
                  <Textarea
                    id="pergunta"
                    value={novoExemplo.pergunta}
                    onChange={(e) => setNovoExemplo(prev => ({ ...prev, pergunta: e.target.value }))}
                    placeholder="Ex: Como gerar um relatório de vendas?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resposta">Resposta Ideal</Label>
                  <Textarea
                    id="resposta"
                    value={novoExemplo.resposta_ideal}
                    onChange={(e) => setNovoExemplo(prev => ({ ...prev, resposta_ideal: e.target.value }))}
                    placeholder="Ex: Para gerar um relatório de vendas..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    value={novoExemplo.categoria}
                    onChange={(e) => setNovoExemplo(prev => ({ ...prev, categoria: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <Button onClick={adicionarExemplo} className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Exemplo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Exemplos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Exemplos de Treinamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exemplos.map((exemplo) => (
                  <Card key={exemplo.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{exemplo.categoria}</Badge>
                          {exemplo.qualidade_resposta && (
                            <Badge variant={getBadgeColor(exemplo.qualidade_resposta)}>
                              {exemplo.qualidade_resposta === 'boa' && <ThumbsUp className="h-3 w-3 mr-1" />}
                              {exemplo.qualidade_resposta === 'media' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {exemplo.qualidade_resposta === 'ruim' && <ThumbsDown className="h-3 w-3 mr-1" />}
                              {exemplo.qualidade_resposta}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Pergunta:</p>
                          <p className="text-sm text-blue-700">{exemplo.pergunta}</p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Resposta Ideal:</p>
                          <p className="text-sm text-green-700">{exemplo.resposta_ideal}</p>
                        </div>

                        {exemplo.resposta_atual && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-800">Resposta Atual da IA:</p>
                            <p className="text-sm text-gray-700">{exemplo.resposta_atual}</p>
                          </div>
                        )}

                        {exemplo.feedback && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800">Feedback:</p>
                            <p className="text-sm text-yellow-700">{exemplo.feedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Criado em: {exemplo.criado_em.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conhecimento" className="space-y-6">
          {/* Adicionar Nova Base de Conhecimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Adicionar à Base de Conhecimento
              </CardTitle>
              <CardDescription>
                Adicione informações específicas sobre sua empresa para a IA usar como referência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={novaBase.titulo}
                    onChange={(e) => setNovaBase(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ex: Processo de Vendas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria-base">Categoria</Label>
                  <select
                    id="categoria-base"
                    value={novaBase.categoria}
                    onChange={(e) => setNovaBase(prev => ({ ...prev, categoria: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo">Conteúdo</Label>
                <Textarea
                  id="conteudo"
                  value={novaBase.conteudo}
                  onChange={(e) => setNovaBase(prev => ({ ...prev, conteudo: e.target.value }))}
                  placeholder="Descreva o processo, política ou informação..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={novaBase.tags}
                  onChange={(e) => setNovaBase(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Ex: vendas, processo, pipeline"
                />
              </div>

              <Button onClick={adicionarBaseConhecimento}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar à Base
              </Button>
            </CardContent>
          </Card>

          {/* Lista da Base de Conhecimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Base de Conhecimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {baseConhecimento.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.titulo}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{item.categoria}</Badge>
                            <Badge variant={item.ativo ? 'default' : 'secondary'}>
                              {item.ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{item.conteudo}</p>

                      <div className="flex items-center gap-2">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Criado em: {item.criado_em.toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Importar Dados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Importar Dados de Treinamento
                </CardTitle>
                <CardDescription>
                  Importe exemplos de treinamento e base de conhecimento de arquivos CSV ou JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Suportamos arquivos CSV e JSON. Certifique-se de que os dados estão no formato correto.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Exemplos de Treinamento
                  </Button>
                  
                  <Button variant="outline" className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Base de Conhecimento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exportar Dados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportar Dados de Treinamento
                </CardTitle>
                <CardDescription>
                  Exporte seus dados de treinamento para backup ou transferência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Os dados serão exportados em formato JSON para máxima compatibilidade.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Exemplos de Treinamento
                  </Button>
                  
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Base de Conhecimento
                  </Button>
                  
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Tudo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações de Treinamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Ações de Treinamento
              </CardTitle>
              <CardDescription>
                Execute processos de treinamento e otimização da IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  Funcionalidade em desenvolvimento. Em breve você poderá treinar a IA com seus dados personalizados.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" disabled>
                  <Brain className="h-4 w-4 mr-2" />
                  Iniciar Treinamento
                </Button>
                
                <Button variant="outline" disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validar Respostas
                </Button>
                
                <Button variant="outline" disabled>
                  <Zap className="h-4 w-4 mr-2" />
                  Otimizar Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}