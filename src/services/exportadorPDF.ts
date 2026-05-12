import { Ficha } from '@/types/ficha.types';

export async function exportarFichaPDF(ficha: Ficha, element: HTMLElement): Promise<void> {
  const printStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      color: #2C3E50;
      background: #fff;
      padding: 32px 40px;
    }

    /* ── CABEÇALHO full-width ── */
    .ficha-header { width: 100%; margin-bottom: 16px; }

    .ficha-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #00205B;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .ficha-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1862BC;
      margin-bottom: 10px;
    }

    .ficha-meta {
      font-size: 10px;
      color: #6B7684;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }

    /* ── CONTEÚDO em 2 COLUNAS (estilo revista) ── */
    .ficha-colunas {
      column-count: 2;
      column-gap: 20px;
      column-rule: 1px solid #e5e5e5;
      width: 100%;
    }

    /* H2 dentro das colunas = título de seção → ocupa largura TOTAL */
    .ficha-colunas h2 {
      column-span: all;
      font-size: 15px;
      font-weight: 700;
      color: #00205B;
      margin: 18px 0 10px;
      padding-bottom: 4px;
      border-bottom: 2px solid #01CFAB;
    }

    /* H3 = subseção dentro das colunas */
    .ficha-colunas h3 {
      font-size: 12px;
      font-weight: 700;
      color: #1862BC;
      margin: 12px 0 6px;
      break-after: avoid;
    }

    /* .para — wrapper do parágrafo (div evita HTML inválido com blocos internos) */
    .ficha-colunas .para {
      font-size: 11px;
      line-height: 1.55;
      margin-bottom: 8px;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      overflow-wrap: break-word;
      word-break: break-word;
      overflow: hidden;        /* impede transbordo além da coluna */
      max-width: 100%;
      box-sizing: border-box;
    }
    /* filhos herdam tamanho e ficam contidos */
    .ficha-colunas .para p,
    .ficha-colunas .para div,
    .ficha-colunas .para span {
      font-size: inherit;
      line-height: inherit;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      overflow-wrap: break-word;
      word-break: break-word;
      max-width: 100%;
      box-sizing: border-box;
    }

    .ficha-colunas ul {
      list-style: none;
      padding: 0;
      margin-bottom: 8px;
    }
    .ficha-colunas ul li {
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 4px;
      padding-left: 14px;
      position: relative;
    }
    .ficha-colunas ul li::before {
      content: "•";
      color: #01CFAB;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    /* Rich text dentro de parágrafos */
    .ficha-colunas .para strong { font-weight: 700; }
    .ficha-colunas .para em { font-style: italic; }
    .ficha-colunas .para u { text-decoration: underline; }
    .ficha-colunas .para s { text-decoration: line-through; }
    .ficha-colunas .para a { color: #1862BC; text-decoration: underline; }
    .ficha-colunas .para code {
      background: #f0f0f0;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.88em;
    }
    /* Tabelas ocupam a coluna inteira */
    .ficha-colunas table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      break-inside: avoid;
      font-size: 10px;
    }
    .ficha-colunas th {
      background: #00205B;
      color: #fff;
      padding: 6px 8px;
      text-align: left;
    }
    .ficha-colunas td {
      padding: 5px 8px;
      border: 1px solid #ccc;
    }
    .ficha-colunas tr:nth-child(even) td { background: #F5F7FA; }

    /* Callout */
    .callout {
      background: #F5F7FA;
      border-left: 3px solid #01CFAB;
      padding: 10px 14px;
      margin-bottom: 10px;
      border-radius: 4px;
      break-inside: avoid;
      font-size: 11px;
    }
    .callout-aviso   { border-color: #FFC107; background: #fffbeb; }
    .callout-critico { border-color: #DC3545; background: #fff5f5; }
    .callout-titulo  { font-weight: 700; color: #00205B; margin-bottom: 4px; font-size: 11px; }

    /* Imagens — fica dentro da coluna.
       max-height impede que uma imagem alta ultrapasse a coluna e
       quebre o layout de 2 colunas no Chrome. */
    .ficha-colunas figure {
      margin: 8px 0;
      text-align: center;
      overflow: hidden;
    }
    .ficha-colunas img {
      max-width: 100%;
      max-height: 220px;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
      margin: 0 auto;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    .ficha-colunas figcaption {
      text-align: center;
      font-size: 10px;
      color: #6B7684;
      margin-top: 4px;
    }

    .ficha-footer {
      column-span: all;
      font-size: 10px;
      color: #6B7684;
      text-align: center;
      border-top: 1px solid #eee;
      padding-top: 10px;
      margin-top: 20px;
    }

    /* margin:0 elimina o espaço onde o browser insere data/hora/título */
    @page { margin: 0; size: A4 portrait; }
    /* o padding do body substitui as margens da página */
    @media print { body { padding: 12mm 15mm 6mm 15mm; } }
  `;

  const conteudoHTML = gerarHTMLFicha(ficha);

  const janela = window.open('', '_blank', 'width=900,height=700');
  if (!janela) {
    throw new Error('Popup bloqueado. Permita popups para este site e tente novamente.');
  }

  janela.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8"/>
      <title>${ficha.titulo}</title>
      <style>${printStyles}</style>
    </head>
    <body>
      ${conteudoHTML}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 800);
        };
      <\/script>
    </body>
    </html>
  `);
  janela.document.close();
}

function gerarHTMLFicha(ficha: Ficha): string {
  const secoes = ficha.secoes.map((secao) => {
    if (secao.tipo === 'h2') {
      return `<h2>${esc(secao.titulo)}</h2>`;
    }
    if (secao.tipo === 'h3') {
      return `<h3>${esc(secao.titulo)}</h3>`;
    }
    if (secao.tipo === 'paragrafo') {
      /* div.para em vez de <p> evita HTML inválido quando o conteúdo
         do RichTextEditor já contém elementos de bloco (<p>, <div>).
         O seletor .ficha-colunas .para garante font-size:11px em tudo. */
      return `<div class="para">${secao.conteudo || ''}</div>`;
    }
    if (secao.tipo === 'lista' && secao.itens) {
      const itens = secao.itens.map((i) => `<li>${esc(i)}</li>`).join('');
      return `<ul>${itens}</ul>`;
    }
    if (secao.tipo === 'tabela' && secao.tabela) {
      const headers = secao.tabela.headers.map((h) => `<th>${esc(h)}</th>`).join('');
      const rows = secao.tabela.rows.map(
        (row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`
      ).join('');
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    if (secao.tipo === 'callout' && secao.callout) {
      const cls = `callout callout-${secao.callout.tipo}`;
      const titulo = secao.callout.titulo
        ? `<div class="callout-titulo">${esc(secao.callout.titulo)}</div>` : '';
      return `<div class="${cls}">${titulo}<p>${esc(secao.callout.conteudo)}</p></div>`;
    }
    if (secao.tipo === 'imagem' && secao.imagem?.dataUrl) {
      return `<figure><img src="${secao.imagem.dataUrl}" alt="${esc(secao.imagem.legenda)}"/>
        <figcaption>${esc(secao.imagem.legenda)}</figcaption></figure>`;
    }
    return '';
  }).join('\n');

  return `
    <div class="ficha-header">
      <h1>${esc(ficha.titulo)}</h1>
      ${ficha.subtitulo ? `<h2>${esc(ficha.subtitulo)}</h2>` : ''}
    </div>
    <div class="ficha-colunas">
      ${secoes}
    </div>
  `;
}

function esc(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function exportarFichaDOCX(ficha: Ficha): Promise<void> {
  alert('Exportação DOCX será implementada em breve!');
}
