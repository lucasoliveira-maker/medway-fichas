'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Ficha, Secao, SecaoTipo } from '@/types/ficha.types';
import { Heading } from '@/components/Medway/Heading';
import { RichTextEditor } from './RichTextEditor';

interface FormularioFichaProps {
  ficha: Ficha;
  onUpdateTitulo: (titulo: string) => void;
  onUpdateSubtitulo: (subtitulo: string) => void;
  onAddSecao: (tipo: SecaoTipo) => void;
  onAddSecaoAt: (tipo: SecaoTipo, afterIndex: number) => void;
  onUpdateSecao: (secaoId: string, updates: Partial<Secao>) => void;
  onRemoveSecao: (secaoId: string) => void;
}

const TIPO_LABELS: Record<SecaoTipo, string> = {
  h2: 'H2 — Seção Principal',
  h3: 'H3 — Subseção',
  paragrafo: 'Parágrafo',
  lista: 'Lista',
  tabela: 'Tabela',
  imagem: 'Imagem',
  callout: 'Callout',
};

/** Separador entre seções com mini-menu para inserir nova seção naquele ponto */
function InsertSeparator({ onInsert }: { onInsert: (tipo: SecaoTipo) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center gap-2 py-1 group">
      {/* linha divisória */}
      <div className="flex-1 h-px bg-gray-200 group-hover:bg-medway-primary/40 transition" />

      {/* botão "+" */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Inserir seção aqui"
        className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-gray-300
                   text-xs font-semibold text-medway-gray bg-white
                   hover:border-medway-primary hover:text-medway-primary hover:bg-medway-primary/5
                   transition whitespace-nowrap"
      >
        <span className="text-base leading-none">+</span> inserir aqui
      </button>

      {/* linha divisória */}
      <div className="flex-1 h-px bg-gray-200 group-hover:bg-medway-primary/40 transition" />

      {/* dropdown de tipo */}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-20 mt-1
                        bg-white border border-gray-200 rounded-md shadow-medway-lg
                        min-w-[180px] py-1 text-sm">
          {(Object.keys(TIPO_LABELS) as SecaoTipo[]).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => { onInsert(tipo); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-medway-dark hover:bg-medway-primary/10 hover:text-medway-primary transition"
            >
              {TIPO_LABELS[tipo]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormularioFicha({
  ficha,
  onUpdateTitulo,
  onUpdateSubtitulo,
  onAddSecao,
  onAddSecaoAt,
  onUpdateSecao,
  onRemoveSecao,
}: FormularioFichaProps) {
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-medway-dark mb-2">
          Título Principal (H1)
        </label>
        <input
          type="text"
          value={ficha.titulo}
          onChange={(e) => onUpdateTitulo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
          placeholder="Digite o título da ficha"
        />
      </div>

      {/* Subtítulo */}
      <div>
        <label className="block text-sm font-semibold text-medway-dark mb-2">
          Subtítulo
        </label>
        <input
          type="text"
          value={ficha.subtitulo || ''}
          onChange={(e) => onUpdateSubtitulo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
          placeholder="Digite um subtítulo (opcional)"
        />
      </div>

      {/* Seções */}
      <div>
        <Heading level={3} className="mb-4">
          Seções
        </Heading>
        <div className="space-y-0">
          {ficha.secoes.map((secao, index) => (
            <React.Fragment key={secao.id}>
              {/* Separador ANTES de cada seção (exceto a primeira) */}
              {index > 0 && (
                <InsertSeparator onInsert={(tipo) => onAddSecaoAt(tipo, index - 1)} />
              )}
              <SecaoInput
                secao={secao}
                onUpdate={(updates) => onUpdateSecao(secao.id, updates)}
                onRemove={() => onRemoveSecao(secao.id)}
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Botão Adicionar Seção */}
      <div className="pt-4">
        <button
          onClick={() => onAddSecao('paragrafo')}
          className="w-full bg-medway-primary text-white font-semibold py-2 px-4 rounded-sm hover:bg-opacity-90 transition"
        >
          + Adicionar Seção
        </button>
      </div>
    </div>
  );
}

interface SecaoInputProps {
  secao: Secao;
  onUpdate: (updates: Partial<Secao>) => void;
  onRemove: () => void;
}

function SecaoInput({ secao, onUpdate, onRemove }: SecaoInputProps) {
  return (
    <div className="border border-gray-300 rounded-sm p-4 bg-medway-light/20 space-y-3">
      {/* Tipo de Seção */}
      <div>
        <label className="text-sm font-semibold text-medway-dark block mb-1">
          Tipo
        </label>
        <select
          value={secao.tipo}
          onChange={(e) => onUpdate({ tipo: e.target.value as SecaoTipo })}
          className="w-full px-3 py-1 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
        >
          <option value="h2">H2 - Seção Principal</option>
          <option value="h3">H3 - Subseção</option>
          <option value="paragrafo">Parágrafo</option>
          <option value="lista">Lista</option>
          <option value="tabela">Tabela</option>
          <option value="imagem">Imagem</option>
          <option value="callout">Callout</option>
        </select>
      </div>

      {/* Conteúdo baseado no tipo */}
      {(secao.tipo === 'h2' || secao.tipo === 'h3') && (
        <div>
          <label className="text-sm font-semibold text-medway-dark block mb-1">
            Título
          </label>
          <input
            type="text"
            value={secao.titulo || ''}
            onChange={(e) => onUpdate({ titulo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
            placeholder="Digite o título"
          />
        </div>
      )}

      {secao.tipo === 'paragrafo' && (
        <div>
          <label className="text-sm font-semibold text-medway-dark block mb-1">
            Texto
          </label>
          <RichTextEditor
            value={secao.conteudo || ''}
            onChange={(html) => onUpdate({ conteudo: html })}
            placeholder="Digite o parágrafo..."
            minRows={4}
          />
        </div>
      )}

      {secao.tipo === 'lista' && (
        <div>
          <label className="text-sm font-semibold text-medway-dark block mb-1">
            Itens (um por linha)
          </label>
          <textarea
            value={secao.itens?.join('\n') || ''}
            onChange={(e) => onUpdate({ itens: e.target.value.split('\n').filter(Boolean) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
            rows={3}
            placeholder="Item 1&#10;Item 2&#10;Item 3"
          />
        </div>
      )}

      {secao.tipo === 'imagem' && (
        <div className="space-y-3">
          {/* Preview da imagem atual */}
          {secao.imagem?.dataUrl && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={secao.imagem.dataUrl}
                alt={secao.imagem.legenda || 'preview'}
                className="w-full max-h-48 object-contain rounded border border-gray-200 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => onUpdate({ imagem: { dataUrl: '', legenda: secao.imagem?.legenda || '' } })}
                className="absolute top-1 right-1 bg-white border border-gray-300 rounded-full w-6 h-6 text-xs text-medway-error hover:bg-red-50 transition flex items-center justify-center"
                title="Remover imagem"
              >
                ✕
              </button>
            </div>
          )}

          {/* Botão de upload */}
          <div>
            <label className="text-sm font-semibold text-medway-dark block mb-1">
              {secao.imagem?.dataUrl ? 'Trocar imagem' : 'Inserir imagem'}
            </label>
            <label className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 border-2 border-dashed border-medway-primary rounded-sm text-sm text-medway-secondary hover:bg-medway-primary/5 transition">
              <svg className="w-5 h-5 text-medway-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>{secao.imagem?.dataUrl ? 'Clique para trocar' : 'Clique para selecionar (PNG, JPG, SVG…)'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    onUpdate({
                      imagem: {
                        dataUrl: reader.result as string,
                        legenda: secao.imagem?.legenda || '',
                      },
                    });
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          {/* Legenda */}
          <div>
            <label className="text-sm font-semibold text-medway-dark block mb-1">
              Legenda
            </label>
            <input
              type="text"
              value={secao.imagem?.legenda || ''}
              onChange={(e) =>
                onUpdate({
                  imagem: {
                    dataUrl: secao.imagem?.dataUrl || '',
                    legenda: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
              placeholder="Descrição ou legenda da imagem"
            />
          </div>
        </div>
      )}

      {secao.tipo === 'callout' && (
        <div className="space-y-2">
          <div>
            <label className="text-sm font-semibold text-medway-dark block mb-1">
              Tipo de Callout
            </label>
            <select
              value={secao.callout?.tipo || 'info'}
              onChange={(e) =>
                onUpdate({
                  callout: {
                    tipo: e.target.value as any,
                    titulo: secao.callout?.titulo,
                    conteudo: secao.callout?.conteudo || '',
                  },
                })
              }
              className="w-full px-3 py-1 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
            >
              <option value="info">Info</option>
              <option value="aviso">Aviso</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-medway-dark block mb-1">
              Título (opcional)
            </label>
            <input
              type="text"
              value={secao.callout?.titulo || ''}
              onChange={(e) =>
                onUpdate({
                  callout: {
                    tipo: secao.callout?.tipo || 'info',
                    titulo: e.target.value,
                    conteudo: secao.callout?.conteudo || '',
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
              placeholder="Título"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-medway-dark block mb-1">
              Conteúdo
            </label>
            <textarea
              value={secao.callout?.conteudo || ''}
              onChange={(e) =>
                onUpdate({
                  callout: {
                    tipo: secao.callout?.tipo || 'info',
                    titulo: secao.callout?.titulo,
                    conteudo: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
              rows={2}
              placeholder="Conteúdo do callout"
            />
          </div>
        </div>
      )}

      {/* Botão Remover */}
      <button
        onClick={onRemove}
        className="w-full text-medway-error border border-medway-error py-1 px-3 rounded-sm text-sm hover:bg-red-50 transition"
      >
        Remover
      </button>
    </div>
  );
}
