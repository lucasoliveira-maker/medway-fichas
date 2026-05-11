import { Ficha, Secao } from '@/types/ficha.types';

interface ValidationResult {
  conformeMedway: boolean;
  erros: string[];
  avisos: string[];
}

export function validarFichaMedway(ficha: Ficha): ValidationResult {
  const erros: string[] = [];
  const avisos: string[] = [];

  // 1. Validar título
  if (!ficha.titulo || ficha.titulo.trim().length === 0) {
    erros.push('Título principal (H1) é obrigatório');
  }

  // 2. Validar estrutura de seções
  if (ficha.secoes.length === 0) {
    erros.push('Ficha deve ter pelo menos uma seção');
  }

  // 3. Validar H1 único
  const h1Count = ficha.secoes.filter((s) => s.tipo === 'h2' && s.ordem === 0).length;
  if (h1Count > 1) {
    avisos.push('Apenas um H1 (primeiro H2) deve existir na ficha');
  }

  // 4. Validar hierarquia
  let ultimoH2 = -1;
  ficha.secoes.forEach((secao, index) => {
    if (secao.tipo === 'h2') {
      ultimoH2 = index;
    } else if (secao.tipo === 'h3' && ultimoH2 === -1) {
      avisos.push(`H3 (seção ${index}) deve vir após um H2`);
    }
  });

  // 5. Validar conteúdo
  ficha.secoes.forEach((secao, index) => {
    if (secao.tipo === 'paragrafo' && (!secao.conteudo || secao.conteudo.trim().length === 0)) {
      avisos.push(`Parágrafo na posição ${index} está vazio`);
    }

    if (secao.tipo === 'h2' && (!secao.titulo || secao.titulo.trim().length === 0)) {
      erros.push(`Título H2 na posição ${index} está vazio`);
    }

    if (secao.tipo === 'h3' && (!secao.titulo || secao.titulo.trim().length === 0)) {
      erros.push(`Título H3 na posição ${index} está vazio`);
    }

    if (secao.tipo === 'lista' && (!secao.itens || secao.itens.length === 0)) {
      avisos.push(`Lista na posição ${index} está vazia`);
    }

    if (secao.tipo === 'tabela' && (!secao.tabela || secao.tabela.headers.length === 0)) {
      avisos.push(`Tabela na posição ${index} não tem headers`);
    }

    if (secao.tipo === 'callout' && (!secao.callout || !secao.callout.conteudo)) {
      avisos.push(`Callout na posição ${index} está vazio`);
    }
  });

  // 6. Validar metadata
  if (!ficha.metadados.tipo) {
    avisos.push('Tipo de ficha não definido (clínica/teórica/procedimento)');
  }

  const conformeMedway = erros.length === 0;

  return {
    conformeMedway,
    erros,
    avisos,
  };
}

// Validar seção individual
export function validarSecao(secao: Secao): { valida: boolean; erros: string[] } {
  const erros: string[] = [];

  if (secao.tipo === 'paragrafo') {
    if (!secao.conteudo || secao.conteudo.trim().length === 0) {
      erros.push('Parágrafo não pode estar vazio');
    }
  }

  if ((secao.tipo === 'h2' || secao.tipo === 'h3') && (!secao.titulo || secao.titulo.trim().length === 0)) {
    erros.push(`Título não pode estar vazio`);
  }

  if (secao.tipo === 'lista' && (!secao.itens || secao.itens.length === 0)) {
    erros.push('Lista deve ter pelo menos um item');
  }

  return {
    valida: erros.length === 0,
    erros,
  };
}
