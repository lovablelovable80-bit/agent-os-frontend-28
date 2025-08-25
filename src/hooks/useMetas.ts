import { useState, useEffect } from 'react';

export interface MetaSalva {
  id: string;
  tempoOS: string;
  vendas: string;
  garantia: string;
  faturamento: string;
  margemLucro: string;
  totalOS: string;
  satisfacaoCliente: string;
  produtividade: string;
  custosOperacionais: string;
  ticketMedio: string;
  dataCriacao: string;
  status: 'ativa' | 'pausada' | 'concluida';
  progresso?: number;
}

export function useMetas() {
  const [metas, setMetas] = useState<MetaSalva[]>([]);

  // Carregar metas do localStorage
  useEffect(() => {
    const metasStorage = localStorage.getItem('metas-agentOS');
    if (metasStorage) {
      setMetas(JSON.parse(metasStorage));
    }
  }, []);

  // Função para obter estatísticas das metas
  const getEstatisticas = () => {
    if (metas.length === 0) return null;

    const metasAtivas = metas.filter(m => m.status === 'ativa');
    const metasConcluidas = metas.filter(m => m.status === 'concluida');
    
    return {
      total: metas.length,
      ativas: metasAtivas.length,
      concluidas: metasConcluidas.length,
      pausadas: metas.filter(m => m.status === 'pausada').length,
      progressoMedio: Math.round(metas.reduce((acc, meta) => acc + (meta.progresso || 0), 0) / metas.length),
      totalVendas: metas.reduce((acc, meta) => acc + parseInt(meta.vendas), 0),
      totalFaturamento: metas.reduce((acc, meta) => acc + parseInt(meta.faturamento), 0),
      margemMedia: Math.round(metas.reduce((acc, meta) => acc + parseInt(meta.margemLucro), 0) / metas.length),
      tempoMedioOS: metas.reduce((acc, meta) => acc + parseFloat(meta.tempoOS), 0) / metas.length,
      garantiaMedia: Math.round(metas.reduce((acc, meta) => acc + parseInt(meta.garantia), 0) / metas.length)
    };
  };

  // Função para obter meta por tipo
  const getMetaPorTipo = (tipo: 'vendas' | 'faturamento' | 'tempoOS' | 'garantia' | 'margemLucro') => {
    if (metas.length === 0) return null;
    
    const metaAtiva = metas.find(m => m.status === 'ativa');
    if (!metaAtiva) return null;

    switch (tipo) {
      case 'vendas':
        return { valor: parseInt(metaAtiva.vendas), progresso: metaAtiva.progresso || 0 };
      case 'faturamento':
        return { valor: parseInt(metaAtiva.faturamento), progresso: metaAtiva.progresso || 0 };
      case 'tempoOS':
        return { valor: parseFloat(metaAtiva.tempoOS), progresso: metaAtiva.progresso || 0 };
      case 'garantia':
        return { valor: parseInt(metaAtiva.garantia), progresso: metaAtiva.progresso || 0 };
      case 'margemLucro':
        return { valor: parseInt(metaAtiva.margemLucro), progresso: metaAtiva.progresso || 0 };
      default:
        return null;
    }
  };

  // Função para verificar se uma meta está sendo cumprida
  const isMetaCumprida = (valorAtual: number, valorMeta: number, tipo: 'crescimento' | 'reducao' = 'crescimento') => {
    if (tipo === 'crescimento') {
      return valorAtual >= valorMeta;
    } else {
      return valorAtual <= valorMeta;
    }
  };

  return {
    metas,
    setMetas,
    getEstatisticas,
    getMetaPorTipo,
    isMetaCumprida,
    hasMetas: metas.length > 0
  };
}