export interface Curso {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;   // hex — cor de destaque do card
  icone: string; // emoji
  criado: Date;
  atualizado: Date;
}
