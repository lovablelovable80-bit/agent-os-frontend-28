import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, config } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Construir contexto da empresa se autorizado
    let contextoEmpresa = "";
    if (config.usar_dados_empresa && config.tabelas_autorizadas?.length > 0) {
      for (const tabela of config.tabelas_autorizadas) {
        try {
          const { data, error } = await supabase
            .from(tabela)
            .select('*')
            .limit(10);
          
          if (data && !error) {
            contextoEmpresa += `\n\nDados da tabela ${tabela}:\n${JSON.stringify(data, null, 2)}`;
          }
        } catch (error) {
          console.error(`Erro ao buscar dados da tabela ${tabela}:`, error);
        }
      }
    }

    // Preparar mensagens para OpenAI
    const systemPrompt = `${config.prompt_sistema}

${config.conhecimento_personalizado ? `Conhecimento personalizado: ${config.conhecimento_personalizado}` : ''}

${contextoEmpresa ? `Contexto dos dados da empresa: ${contextoEmpresa}` : ''}

Você tem acesso às seguintes tabelas: ${config.tabelas_autorizadas?.join(', ') || 'nenhuma'}

Responda de forma útil e precisa baseado nos dados fornecidos. Se precisar realizar operações no banco de dados, descreva exatamente o que faria.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: config.temperatura || 0.7,
        max_tokens: config.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    // Log da interação
    console.log('IA Assistant - Pergunta:', message);
    console.log('IA Assistant - Resposta:', assistantResponse);

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função ia-assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});