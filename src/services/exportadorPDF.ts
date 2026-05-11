import { Ficha } from '@/types/ficha.types';

export async function exportarFichaPDF(ficha: Ficha, element: HTMLElement): Promise<void> {
  const printStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      color: #2C3E50;
      background: #fff;
      padding: 40px 50px;
    }

    h1 { font-size: 36px; font-weight: 700; color: #00205B; margin-bottom: 8px; }
    h2 { font-size: 24px; font-weight: 700; color: #00205B; margin: 24px 0 12px; }
    h3 { font-size: 18px; font-weight: 600; color: #1862BC; margin: 16px 0 8px; }
    p  { line-height: 1.6; margin-bottom: 12px; }

    ul { list-style: none; padding: 0; margin-bottom: 12px; }
    ul li::before { content: "• "; color: #01CFAB; font-weight: bold; }
    ul li { margin-bottom: 6px; padding-left: 16px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #00205B; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; }
    td { padding: 8px 12px; border: 1px solid #ccc; font-size: 12px; }
    tr:nth-child(even) td { background: #F5F7FA; }

    .callout {
      background: #F5F7FA;
      border-left: 4px solid #01CFAB;
      padding: 16px 20px;
      margin-bottom: 16px;
      border-radius: 4px;
    }
    .callout-aviso  { border-color: #FFC107; background: #fffbeb; }
    .callout-critico { border-color: #DC3545; background: #fff5f5; }
    .callout-titulo { font-weight: 700; color: #00205B; margin-bottom: 6px; }

    img { max-width: 100%; border-radius: 4px; border: 1px solid #ccc; }
    figcaption { text-align: center; font-size: 11px; color: #6B7684; margin-top: 6px; }

    .ficha-meta { font-size: 11px; color: #6B7684; border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 20px; }
    .ficha-footer { font-size: 11px; color: #6B7684; text-align: center; border-top: 1px solid #eee; padding-top: 12px; margin-top: 32px; }

    @page { margin: 20mm; size: A4; }
    @media print { body { padding: 0; } }
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
      return `<p>${esc(secao.conteudo)}</p>`;
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
    <h1>${esc(ficha.titulo)}</h1>
    ${ficha.subtitulo ? `<h2 style="color:#1862BC;margin-top:4px">${esc(ficha.subtitulo)}</h2>` : ''}
    <div class="ficha-meta">
      Tipo: ${ficha.metadados.tipo} &nbsp;|&nbsp;
      Criado em: ${new Date(ficha.metadados.criado).toLocaleDateString('pt-BR')}
    </div>
    ${secoes}
    <div class="ficha-footer">
      Medway Fichas &nbsp;•&nbsp; Medway Design System v1.0 &nbsp;•&nbsp; © ${new Date().getFullYear()}
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
