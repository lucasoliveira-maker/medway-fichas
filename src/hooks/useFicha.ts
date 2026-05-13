'use client';

import { useState, useCallback } from 'react';
import { Ficha, Secao } from '@/types/ficha.types';
import { v4 as uuidv4 } from 'uuid';

interface UseFichaReturn {
  ficha: Ficha;
  updateTitulo: (titulo: string) => void;
  updateSubtitulo: (subtitulo: string) => void;
  updateSecao: (secaoId: string, updates: Partial<Secao>) => void;
  addSecao: (tipo: Secao['tipo']) => void;
  addSecaoAt: (tipo: Secao['tipo'], afterIndex: number) => void;
  removeSecao: (secaoId: string) => void;
  reorderSecoes: (secoes: Secao[]) => void;
  setFicha: (ficha: Ficha) => void;
}

const createEmptyFicha = (): Ficha => {
  const now = new Date();
  return {
    id: uuidv4(),
    titulo: 'Nova Ficha',
    subtitulo: '',
    dataFicha: now,
    logoMedway: true,
    secoes: [
      {
        id: uuidv4(),
        tipo: 'paragrafo',
        ordem: 0,
        conteudo: '',
      },
    ],
    metadados: {
      autor: 'Usuário',
      template: 'blank',
      tags: [],
      tipo: 'teorica',
      criado: now,
      atualizado: now,
    },
    validacao: {
      conformeMedway: false,
      erros: [],
      avisos: [],
      validadoEm: now,
    },
  };
};

export function useFicha(initialFicha?: Ficha): UseFichaReturn {
  const [ficha, setFichaState] = useState<Ficha>(initialFicha || createEmptyFicha());

  const updateTitulo = useCallback((titulo: string) => {
    setFichaState((prev) => ({
      ...prev,
      titulo,
      metadados: { ...prev.metadados, atualizado: new Date() },
    }));
  }, []);

  const updateSubtitulo = useCallback((subtitulo: string) => {
    setFichaState((prev) => ({
      ...prev,
      subtitulo,
      metadados: { ...prev.metadados, atualizado: new Date() },
    }));
  }, []);

  const updateSecao = useCallback((secaoId: string, updates: Partial<Secao>) => {
    setFichaState((prev) => ({
      ...prev,
      secoes: prev.secoes.map((s) =>
        s.id === secaoId ? { ...s, ...updates } : s
      ),
      metadados: { ...prev.metadados, atualizado: new Date() },
    }));
  }, []);

  const addSecao = useCallback((tipo: Secao['tipo']) => {
    const novaSecao: Secao = {
      id: uuidv4(),
      tipo,
      ordem: ficha.secoes.length,
    };

    // Initialize secao based on tipo
    if (tipo === 'paragrafo' || tipo === 'h2' || tipo === 'h3') {
      novaSecao.conteudo = '';
    } else if (tipo === 'lista') {
      novaSecao.itens = [''];
    } else if (tipo === 'tabela') {
      novaSecao.tabela = { headers: [], rows: [] };
    } else if (tipo === 'callout') {
      novaSecao.callout = { tipo: 'info', conteudo: '' };
    } else if (tipo === 'imagem') {
      novaSecao.imagem = { dataUrl: '', legenda: '' };
    } else if (tipo === 'destaque') {
      novaSecao.destaque = { conteudo: '' };
    }

    setFichaState((prev) => ({
      ...prev,
      secoes: [...prev.secoes, novaSecao],
      metadados: { ...prev.metadados, atualizado: new Date() },
    }));
  }, [ficha.secoes.length]);

  const addSecaoAt = useCallback((tipo: Secao['tipo'], afterIndex: number) => {
    const novaSecao: Secao = { id: uuidv4(), tipo, ordem: afterIndex + 1 };
    if (tipo === 'paragrafo' || tipo === 'h2' || tipo === 'h3') novaSecao.conteudo = '';
    else if (tipo === 'lista') novaSecao.itens = [''];
    else if (tipo === 'tabela') novaSecao.tabela = { headers: [], rows: [] };
    else if (tipo === 'callout') novaSecao.callout = { tipo: 'info', conteudo: '' };
    else if (tipo === 'imagem') novaSecao.imagem = { dataUrl: '', legenda: '' };
    else if (tipo === 'destaque') novaSecao.destaque = { conteudo: '' };

    setFichaState((prev) => {
      const arr = [...prev.secoes];
      arr.splice(afterIndex + 1, 0, novaSecao);
      return {
        ...prev,
        secoes: arr.map((s, i) => ({ ...s, ordem: i })),
        metadados: { ...prev.metadados, atualizado: new Date() },
      };
    });
  }, []);

  const removeSecao = useCallback((secaoId: string) => {
    setFichaState((prev) => ({
      ...prev,
      secoes: prev.secoes.filter((s) => s.id !== secaoId),
      metadados: { ...prev.metadados, atualizado: new Date() },
    }));
  }, []);

  const reorderSecoes = useCallback((secoes: Secao[]) => {
    setFichaState((prev) => ({
      ...prev,
      secoes: secoes.map((s, index) => ({ ...s, ordem: index })),
      metadados: { ...prev.metadados, atualizado: new Date() },
    }));
  }, []);

  return {
    ficha,
    updateTitulo,
    updateSubtitulo,
    updateSecao,
    addSecao,
    addSecaoAt,
    removeSecao,
    reorderSecoes,
    setFicha: setFichaState,
  };
}
