export type SecaoTipo = 'h2' | 'h3' | 'paragrafo' | 'lista' | 'tabela' | 'imagem' | 'callout' | 'destaque';
export type CalloutTipo = 'info' | 'aviso' | 'critico';
export type FichaTipo = 'clinica' | 'teorica' | 'procedimento';

export interface Secao {
  id: string;
  tipo: SecaoTipo;
  ordem: number;

  // Para títulos (h2, h3)
  titulo?: string;

  // Para parágrafo
  conteudo?: string;

  // Para listas
  itens?: string[];

  // Para tabelas
  tabela?: {
    headers: string[];
    rows: string[][];
  };

  // Para imagens
  imagem?: {
    dataUrl: string; // base64
    largura?: number;
    legenda: string;
  };

  // Para callouts
  callout?: {
    tipo: CalloutTipo;
    titulo?: string;
    conteudo: string;
  };

  // Para box destaque
  destaque?: {
    conteudo: string; // HTML rico
  };
}

export interface Ficha {
  id: string;
  cursoId?: string; // referência ao curso pai (opcional para compatibilidade)
  titulo: string;
  subtitulo?: string;
  dataFicha: Date;
  logoMedway: boolean;

  secoes: Secao[];

  metadados: {
    autor: string;
    template: string;
    tags: string[];
    tipo: FichaTipo;
    criado: Date;
    atualizado: Date;
  };

  validacao: {
    conformeMedway: boolean;
    erros: string[];
    avisos: string[];
    validadoEm: Date;
  };
}

export interface FichaFormData extends Omit<Ficha, 'id' | 'dataFicha' | 'validacao'> {
  // Simplified form data
}
