import { Ficha } from '@/types/ficha.types';

export async function exportarFichaPDF(ficha: Ficha, element: HTMLElement): Promise<void> {
  const printStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      color: #2C3E50;
      background: transparent;
      margin: 0;
      padding: 0;
    }

    /* Margens fixas em TODAS as páginas — aplica-se inclusive a páginas 2, 3... */
    @page {
      size: A4 portrait;
      margin-top: 15mm;
      margin-bottom: 15mm;
      margin-left: 15mm;
      margin-right: 15mm;

      @bottom-center {
        content: counter(page);
        font-family: 'Montserrat', sans-serif;
        font-size: 10px;
        color: #6B7684;
      }
    }

    /* ── CABEÇALHO full-width ── */
    .ficha-header { width: 100%; margin-bottom: 16px; margin-top: 0; }

    .ficha-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #00205B;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .ficha-header h2 {
      font-size: 19px;
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
      column-gap: 1cm;
      column-rule: 1px solid #e5e5e5;
      column-fill: auto;
      width: 100%;
      font-size: 11px;
    }

    /* H2 dentro das colunas = título de seção → ocupa largura TOTAL */
    .ficha-colunas h2 {
      column-span: all;
      font-size: 17px;
      font-weight: 700;
      color: #00205B;
      margin: 18px 0 10px;
      padding-bottom: 4px;
      border-bottom: 2px solid #01CFAB;
    }

    /* H3 = subseção dentro das colunas */
    .ficha-colunas h3 {
      font-size: 14px;
      font-weight: 700;
      color: #1862BC;
      margin: 12px 0 6px;
      break-after: avoid;
    }

    /* H4 = sub-subseção dentro das colunas */
    .ficha-colunas h4 {
      font-size: 12px;
      font-weight: 700;
      color: #1862BC;
      margin: 10px 0 5px;
      break-after: avoid;
    }

    /* H5 = sub-sub-subseção dentro das colunas */
    .ficha-colunas h5 {
      font-size: 11px;
      font-weight: 700;
      color: #1862BC;
      margin: 8px 0 4px;
      break-after: avoid;
    }

    /* Parágrafo rico */
    .ficha-colunas .para {
      font-size: 11px !important;
      line-height: 1.55;
      margin-bottom: 8px;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    /* descendentes herdam fonte sem redefinir propriedades de layout */
    .ficha-colunas .para * {
      font-size: inherit !important;
      line-height: inherit;
    }
    .ficha-colunas .para p,
    .ficha-colunas .para div { margin-bottom: 4px; }

    /* Listas standalone (tipo='lista') */
    .ficha-colunas > ul {
      list-style: none;
      padding: 0;
      margin-bottom: 8px;
    }
    .ficha-colunas > ul li {
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 4px;
      padding-left: 14px;
      position: relative;
    }
    .ficha-colunas > ul li::before {
      content: "•";
      color: #01CFAB;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    /* Rich text dentro de .para */
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
    /* Listas dentro de parágrafos ricos */
    .ficha-colunas .para ul {
      list-style-type: disc;
      padding-left: 18px;
      margin: 4px 0;
    }
    .ficha-colunas .para ol {
      list-style-type: decimal;
      padding-left: 18px;
      margin: 4px 0;
    }
    .ficha-colunas .para li {
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 2px;
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

    /* Imagens */
    .ficha-colunas img {
      max-width: 100%;
      border-radius: 4px;
      border: 1px solid #ccc;
      break-inside: avoid;
    }
    .ficha-colunas figcaption {
      text-align: center;
      font-size: 10px;
      color: #6B7684;
      margin-top: 4px;
    }

    /* Box Destaque */
    .box-destaque {
      background: #50b9a8;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 10px;
      break-inside: avoid;
      font-size: 11px;
      line-height: 1.55;
      color: #00205B;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      overflow-wrap: anywhere;
      word-break: break-word;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .box-destaque * {
      font-size: inherit !important;
      line-height: inherit;
      color: inherit;
    }
    .box-destaque strong { font-weight: 700; }
    .box-destaque em { font-style: italic; }
    .box-destaque u { text-decoration: underline; }
    .box-destaque ul {
      list-style-type: disc;
      padding-left: 18px;
      margin: 4px 0;
    }
    .box-destaque ol {
      list-style-type: decimal;
      padding-left: 18px;
      margin: 4px 0;
    }
    .box-destaque li { margin-bottom: 2px; }

    /* Fluxo — largura total (sai das 2 colunas) */
    .fluxo-section {
      column-span: all;
      width: 100%;
      margin-bottom: 14px;
      break-inside: avoid;
    }
    .fluxo-section img {
      width: 100%;
      max-width: 100%;
      border-radius: 4px;
      border: 1px solid #ccc;
      display: block;
    }
    .fluxo-section figcaption {
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
  `;



  const conteudoHTML = gerarHTMLFicha(ficha);

  /* Abre janela no tamanho exato A4 a 96 DPI (794×1123px) para colunas calcularem corretamente */
  const janela = window.open('', '_blank', 'width=794,height=1123');
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
          /* 1500ms para garantir que a fonte Montserrat (Google Fonts) carregue */
          setTimeout(function() {
            window.print();
            window.close();
          }, 1500);
        };
      <\/script>
    </body>
    </html>
  `);
  janela.document.close();
}

function formatDate(d: Date | string | undefined): string {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR');
}

function gerarHTMLFicha(ficha: Ficha): string {
  const secoes = ficha.secoes.map((secao) => {
    if (secao.tipo === 'h2') {
      return `<h2>${esc(secao.titulo)}</h2>`;
    }
    if (secao.tipo === 'h3') {
      return `<h3>${esc(secao.titulo)}</h3>`;
    }
    if (secao.tipo === 'h4') {
      return `<h4>${esc(secao.titulo)}</h4>`;
    }
    if (secao.tipo === 'h5') {
      return `<h5>${esc(secao.titulo)}</h5>`;
    }
    if (secao.tipo === 'paragrafo') {
      /* conteudo pode ser HTML rico (divs/p do contentEditable) — usar div.para
         para evitar que elementos-bloco sejam içados para fora de .ficha-colunas.
         stripFontSize remove font-size inline que poderia sobrescrever o CSS. */
      return `<div class="para">${stripFontSize(secao.conteudo || '')}</div>`;
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
    if (secao.tipo === 'destaque' && secao.destaque) {
      return `<div class="box-destaque">${stripFontSize(secao.destaque.conteudo || '')}</div>`;
    }
    if (secao.tipo === 'imagem' && secao.imagem?.dataUrl) {
      return `<figure><img src="${secao.imagem.dataUrl}" alt="${esc(secao.imagem.legenda)}"/>
        <figcaption>${esc(secao.imagem.legenda)}</figcaption></figure>`;
    }
    if (secao.tipo === 'fluxo' && secao.imagem?.dataUrl) {
      return `<figure class="fluxo-section"><img src="${secao.imagem.dataUrl}" alt="${esc(secao.imagem.legenda)}"/>
        <figcaption>${esc(secao.imagem.legenda)}</figcaption></figure>`;
    }
    return '';
  }).join('\n');

  const tipo = ficha.metadados?.tipo ?? '';
  const dataCriado = formatDate(ficha.dataFicha ?? ficha.metadados?.criado);
  const metaPartes: string[] = [];
  if (tipo) metaPartes.push(`Tipo: ${esc(tipo)}`);
  if (dataCriado) metaPartes.push(`Criado em: ${dataCriado}`);

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

/** Remove font-size de qualquer style inline para não sobrescrever o CSS do PDF */
function stripFontSize(html: string): string {
  if (!html) return '';
  return html.replace(/font-size\s*:\s*[^;'"}\s]+\s*;?/gi, '');
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
