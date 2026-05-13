'use client';

import { Ficha } from '@/types/ficha.types';
import { Heading } from './Heading';
import { CalloutBox } from './CalloutBox';
import { TableMedway } from './TableMedway';
import { ListBullets } from './ListBullets';
import { ImageCaption } from './ImageCaption';

interface FichaRendererProps {
  ficha: Ficha;
  preview?: boolean;
  className?: string;
}

export function FichaRenderer({ ficha, preview = false, className = '' }: FichaRendererProps) {
  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Logo Medway (opcional) */}
      {ficha.logoMedway && (
        <div className="mb-8 text-right text-sm text-medway-gray">
          Medway Design System
        </div>
      )}

      {/* Título Principal */}
      <Heading level={1} className="mb-4">
        {ficha.titulo}
      </Heading>

      {/* Subtítulo */}
      {ficha.subtitulo && (
        <Heading level={2} className="mb-8 text-medway-secondary">
          {ficha.subtitulo}
        </Heading>
      )}

      {/* Metadata */}
      <div className="text-sm text-medway-gray mb-8 border-b border-gray-200 pb-4">
        <p className="m-0">
          Criado em: {new Date(ficha.dataFicha).toLocaleDateString('pt-BR')} •
          Tipo: {ficha.metadados.tipo}
        </p>
      </div>

      {/* Seções */}
      <div className="space-y-6">
        {ficha.secoes.map((secao) => (
          <div key={secao.id} className="space-y-4">
            {/* H2 */}
            {secao.tipo === 'h2' && (
              <Heading level={2} className="mt-8 mb-4">
                {secao.titulo}
              </Heading>
            )}

            {/* H3 */}
            {secao.tipo === 'h3' && (
              <Heading level={3} className="mt-6 mb-3">
                {secao.titulo}
              </Heading>
            )}

            {/* H4 */}
            {secao.tipo === 'h4' && (
              <h4 className="mt-5 mb-2 text-lg font-bold text-medway-secondary">
                {secao.titulo}
              </h4>
            )}

            {/* H5 */}
            {secao.tipo === 'h5' && (
              <h5 className="mt-4 mb-2 text-base font-bold text-medway-secondary">
                {secao.titulo}
              </h5>
            )}

            {/* Parágrafo — suporta HTML rico gerado pelo RichTextEditor */}
            {secao.tipo === 'paragrafo' && (
              <div
                lang="pt-BR"
                className="text-body text-medway-text leading-relaxed prose-sm max-w-none
                  [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through
                  [&_a]:text-medway-secondary [&_a]:underline
                  [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-[0.88em]
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                style={{ textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto' }}
                dangerouslySetInnerHTML={{ __html: secao.conteudo || '' }}
              />
            )}

            {/* Lista */}
            {secao.tipo === 'lista' && secao.itens && (
              <ListBullets items={secao.itens} />
            )}

            {/* Tabela */}
            {secao.tipo === 'tabela' && secao.tabela && (
              <TableMedway headers={secao.tabela.headers} rows={secao.tabela.rows} />
            )}

            {/* Imagem */}
            {secao.tipo === 'imagem' && secao.imagem && (
              <ImageCaption
                src={secao.imagem.dataUrl}
                alt={secao.imagem.legenda}
                legenda={secao.imagem.legenda}
              />
            )}

            {/* Callout */}
            {secao.tipo === 'callout' && secao.callout && (
              <CalloutBox
                tipo={secao.callout.tipo}
                titulo={secao.callout.titulo}
              >
                {secao.callout.conteudo}
              </CalloutBox>
            )}

            {/* Fluxos / tabelas / imagens grandes — largura total */}
            {secao.tipo === 'fluxo' && secao.imagem && (
              <figure className="w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={secao.imagem.dataUrl}
                  alt={secao.imagem.legenda}
                  className="w-full rounded border border-gray-200"
                  style={{ display: 'block' }}
                />
                {secao.imagem.legenda && (
                  <figcaption className="text-center text-xs text-medway-gray mt-2">
                    {secao.imagem.legenda}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Box Destaque */}
            {secao.tipo === 'destaque' && secao.destaque && (
              <div
                className="rounded-xl px-5 py-4
                  text-white text-sm leading-relaxed
                  [&_strong]:font-bold [&_em]:italic [&_u]:underline
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                style={{ backgroundColor: '#50b9a8' }}
                dangerouslySetInnerHTML={{ __html: secao.destaque.conteudo || '' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-medway-gray">
        <p className="m-0">
          © Medway Design System • Criado em {new Date(ficha.metadados.criado).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </article>
  );
}
