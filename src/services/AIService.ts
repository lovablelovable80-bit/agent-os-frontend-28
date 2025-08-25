export interface AICommand {
  action: string;
  response: string;
  details: string;
  needsConfirmation: boolean;
  result?: any;
}

interface CommandPattern {
  pattern: RegExp;
  action: string;
  handler: (match: RegExpMatchArray, input: string) => AICommand;
}

export class AIService {
  private static commands: CommandPattern[] = [
    // Ordens de Serviço
    {
      pattern: /(?:criar|nova|gerar)\s*(?:ordem|os|serviço|servico)\s*(?:para|do|da)?\s*([a-zA-Z\s]+)(?:\s*-?\s*(.+))?/i,
      action: "Criar Ordem de Serviço",
      handler: (match, input) => ({
        action: "Ordem de serviço criada",
        response: `✅ Criando ordem de serviço para **${match[1].trim()}**${match[2] ? ` - ${match[2].trim()}` : ''}.\n\n📋 **Detalhes:**\n• Cliente: ${match[1].trim()}\n• Serviço: ${match[2]?.trim() || 'A ser definido'}\n• Status: Pendente\n• Data: ${new Date().toLocaleDateString()}`,
        details: `Nova OS para ${match[1].trim()}`,
        needsConfirmation: true,
        result: {
          type: 'service_order',
          customer: match[1].trim(),
          service: match[2]?.trim() || '',
          status: 'pending',
          date: new Date().toISOString()
        }
      })
    },

    // Cadastro de Produtos
    {
      pattern: /(?:cadastrar|adicionar|criar)\s*(?:produto|item)\s*(.+?)(?:\s*(?:por|valor|preço|preco)\s*(?:r\$)?\s*(\d+(?:,\d{2})?))?/i,
      action: "Cadastrar Produto",
      handler: (match, input) => {
        const price = match[2] ? parseFloat(match[2].replace(',', '.')) : 0;
        return {
          action: "Produto cadastrado",
          response: `✅ Cadastrando produto **${match[1].trim()}**.\n\n🏷️ **Detalhes:**\n• Nome: ${match[1].trim()}\n• Preço: R$ ${price.toFixed(2).replace('.', ',')}\n• Categoria: Produtos\n• Status: Ativo`,
          details: `Produto ${match[1].trim()} adicionado`,
          needsConfirmation: true,
          result: {
            type: 'product',
            name: match[1].trim(),
            price: price,
            category: 'Produtos',
            status: 'active'
          }
        };
      }
    },

    // Cadastro de Serviços
    {
      pattern: /(?:cadastrar|adicionar|criar)\s*(?:serviço|servico)\s*(.+?)(?:\s*(?:por|valor|preço|preco)\s*(?:r\$)?\s*(\d+(?:,\d{2})?))?/i,
      action: "Cadastrar Serviço",
      handler: (match, input) => {
        const price = match[2] ? parseFloat(match[2].replace(',', '.')) : 0;
        return {
          action: "Serviço cadastrado",
          response: `✅ Cadastrando serviço **${match[1].trim()}**.\n\n🔧 **Detalhes:**\n• Nome: ${match[1].trim()}\n• Preço: R$ ${price.toFixed(2).replace('.', ',')}\n• Categoria: Serviços\n• Status: Ativo`,
          details: `Serviço ${match[1].trim()} adicionado`,
          needsConfirmation: true,
          result: {
            type: 'service',
            name: match[1].trim(),
            price: price,
            category: 'Serviços',
            status: 'active'
          }
        };
      }
    },

    // Finalizar Venda
    {
      pattern: /(?:finalizar|fechar|concluir)\s*(?:venda|pedido)\s*(?:para|do|da)?\s*([a-zA-Z\s]+)(?:\s*(?:valor|total)\s*(?:r\$)?\s*(\d+(?:,\d{2})?))?/i,
      action: "Finalizar Venda",
      handler: (match, input) => {
        const total = match[2] ? parseFloat(match[2].replace(',', '.')) : 0;
        return {
          action: "Venda finalizada",
          response: `✅ Finalizando venda para **${match[1].trim()}**.\n\n💰 **Resumo:**\n• Cliente: ${match[1].trim()}\n• Total: R$ ${total.toFixed(2).replace('.', ',')}\n• Forma de pagamento: A definir\n• Data: ${new Date().toLocaleDateString()}`,
          details: `Venda finalizada para ${match[1].trim()}`,
          needsConfirmation: true,
          result: {
            type: 'sale',
            customer: match[1].trim(),
            total: total,
            date: new Date().toISOString(),
            status: 'completed'
          }
        };
      }
    },

    // Cadastrar Cliente
    {
      pattern: /(?:cadastrar|adicionar|criar)\s*(?:cliente|customer)\s*(.+?)(?:\s*(?:telefone|tel|fone)\s*([0-9\s\(\)\-]+))?/i,
      action: "Cadastrar Cliente",
      handler: (match, input) => ({
        action: "Cliente cadastrado",
        response: `✅ Cadastrando cliente **${match[1].trim()}**.\n\n👤 **Detalhes:**\n• Nome: ${match[1].trim()}\n• Telefone: ${match[2]?.trim() || 'Não informado'}\n• Status: Ativo\n• Data de cadastro: ${new Date().toLocaleDateString()}`,
        details: `Cliente ${match[1].trim()} adicionado`,
        needsConfirmation: true,
        result: {
          type: 'customer',
          name: match[1].trim(),
          phone: match[2]?.trim() || '',
          status: 'active',
          registrationDate: new Date().toISOString()
        }
      })
    },

    // Gerar Relatório
    {
      pattern: /(?:gerar|criar|mostrar)\s*(?:relatório|relatorio)\s*(?:de|do)?\s*(vendas|clientes|produtos|serviços|servicos|financeiro)?/i,
      action: "Gerar Relatório",
      handler: (match, input) => {
        const reportType = match[1]?.toLowerCase() || 'geral';
        return {
          action: "Relatório gerado",
          response: `📊 Gerando relatório de **${reportType}**.\n\n📈 **Informações:**\n• Tipo: Relatório de ${reportType}\n• Período: Último mês\n• Status: Processando\n• Formato: PDF/Excel`,
          details: `Relatório de ${reportType} gerado`,
          needsConfirmation: true,
          result: {
            type: 'report',
            category: reportType,
            period: 'last_month',
            format: 'pdf'
          }
        };
      }
    },

    // Buscar informações
    {
      pattern: /(?:buscar|procurar|encontrar|listar)\s*(.+)/i,
      action: "Buscar Informações",
      handler: (match, input) => ({
        action: "Busca realizada",
        response: `🔍 Buscando por **${match[1].trim()}**.\n\n📋 **Resultados encontrados:**\n• Verificando base de dados...\n• Aplicando filtros...\n• Ordenando resultados...`,
        details: `Busca por ${match[1].trim()}`,
        needsConfirmation: true,
        result: {
          type: 'search',
          query: match[1].trim(),
          results: []
        }
      })
    }
  ];

  static async processCommand(input: string): Promise<AICommand> {
    const normalizedInput = input.trim();

    // Procura por padrões conhecidos
    for (const command of this.commands) {
      const match = normalizedInput.match(command.pattern);
      if (match) {
        return command.handler(match, normalizedInput);
      }
    }

    // Se não encontrou padrão específico, resposta genérica
    return {
      action: "Comando não reconhecido",
      response: `🤔 Não consegui entender completamente seu comando: "${normalizedInput}"\n\n💡 **Experimente comandos como:**\n• "Criar ordem de serviço para João"\n• "Cadastrar produto iPhone 15 por R$ 3000"\n• "Finalizar venda para Maria valor R$ 150"\n• "Cadastrar cliente Pedro telefone (11) 99999-9999"\n• "Gerar relatório de vendas"`,
      details: "Comando não reconhecido",
      needsConfirmation: false
    };
  }

  // Método para executar ações reais no sistema
  static async executeCommand(command: AICommand): Promise<boolean> {
    try {
      switch (command.result?.type) {
        case 'service_order':
          // Integrar com sistema de ordens de serviço
          console.log('Criando ordem de serviço:', command.result);
          break;
        
        case 'product':
        case 'service':
          // Integrar com sistema de produtos/serviços
          console.log('Cadastrando item:', command.result);
          break;
        
        case 'sale':
          // Integrar com sistema de vendas
          console.log('Finalizando venda:', command.result);
          break;
        
        case 'customer':
          // Integrar com sistema de clientes
          console.log('Cadastrando cliente:', command.result);
          break;
        
        case 'report':
          // Integrar com sistema de relatórios
          console.log('Gerando relatório:', command.result);
          break;
        
        case 'search':
          // Integrar com sistema de busca
          console.log('Realizando busca:', command.result);
          break;
        
        default:
          console.log('Comando genérico:', command);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao executar comando:', error);
      return false;
    }
  }
}