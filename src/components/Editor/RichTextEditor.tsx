'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { RulerBar, IndentMarkers } from './RulerBar';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

const MAX_INDENT_PX = 140; // 100% da régua = 140 px de recuo

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Digite o parágrafo...',
  minRows = 4,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const suppressSync = useRef(false);
  const savedRange = useRef<Range | null>(null); // último Range antes de clicar na régua

  const [indentMarkers, setIndentMarkers] = useState<IndentMarkers>({
    leftIndent: 0,
    firstLine: 0,
  });

  /* ─────────────────────────────────────────────────────────────────
     Sync external value → DOM  (só quando vem de fora, e.g. load)
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!editorRef.current) return;
    if (suppressSync.current) { suppressSync.current = false; return; }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value ?? '';
    }
  }, [value]);

  /* ─────────────────────────────────────────────────────────────────
     Emite HTML para o parent
  ───────────────────────────────────────────────────────────────── */
  const emit = useCallback(() => {
    if (!editorRef.current) return;
    suppressSync.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  /* ─────────────────────────────────────────────────────────────────
     execCommand wrapper
  ───────────────────────────────────────────────────────────────── */
  const exec = useCallback(
    (cmd: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val ?? undefined);
      emit();
    },
    [emit],
  );

  /* ─────────────────────────────────────────────────────────────────
     Salva o Range atual (para restaurar ao arrastar a régua)
  ───────────────────────────────────────────────────────────────── */
  const saveRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────────
     Lê o recuo do bloco onde está o cursor e atualiza a régua
  ───────────────────────────────────────────────────────────────── */
  const readIndentFromCursor = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let node: Node | null = sel.getRangeAt(0).startContainer;
    while (node && node !== editor) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (tag === 'li') {
          // cada <li> usa margin-left individualmente
          const ml = parseFloat(el.style.marginLeft) || 0;
          setIndentMarkers({ leftIndent: ml / MAX_INDENT_PX, firstLine: ml / MAX_INDENT_PX });
          return;
        }
        if (['ul', 'ol', 'p', 'div'].includes(tag)) {
          const pl = parseFloat(el.style.paddingLeft) || 0;
          const ti = parseFloat(el.style.textIndent) || 0;
          setIndentMarkers({
            leftIndent: pl / MAX_INDENT_PX,
            firstLine: (pl + ti) / MAX_INDENT_PX,
          });
          return;
        }
      }
      node = node.parentNode;
    }
    setIndentMarkers({ leftIndent: 0, firstLine: 0 });
  }, []);

  /* ─────────────────────────────────────────────────────────────────
     Aplica recuo ao bloco mais próximo do cursor salvo.
     — <li>  → margin-left  (move bullet + texto individualmente)
     — <p>/<div> → padding-left + text-indent
     — <ul>/<ol> → padding-left (caso cursor não esteja dentro de <li>)
  ───────────────────────────────────────────────────────────────── */
  const applyIndent = useCallback(
    (left: number, firstLine: number) => {
      const editor = editorRef.current;
      if (!editor) return;

      // Restaura o range salvo para encontrar o bloco correto
      if (savedRange.current) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(savedRange.current);
      }

      const leftPx = Math.round(left * MAX_INDENT_PX);
      const firstLinePx = Math.round(firstLine * MAX_INDENT_PX);

      const sel = window.getSelection();
      let target: HTMLElement | null = null;
      let targetTag = '';

      if (sel && sel.rangeCount > 0) {
        let node: Node | null = sel.getRangeAt(0).startContainer;
        while (node && node !== editor) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tag = el.tagName.toLowerCase();
            if (tag === 'li') { target = el; targetTag = 'li'; break; }
            if (['ul', 'ol', 'p', 'div'].includes(tag)) { target = el; targetTag = tag; break; }
          }
          node = node.parentNode;
        }
      }

      if (!target && editor.firstElementChild) {
        target = editor.firstElementChild as HTMLElement;
        targetTag = target.tagName.toLowerCase();
      }

      if (target) {
        if (targetTag === 'li') {
          // bullet individual: margin-left move o bullet E o texto juntos
          target.style.marginLeft = leftPx > 0 ? `${leftPx}px` : '';
        } else {
          target.style.paddingLeft = leftPx > 0 ? `${leftPx}px` : '';
          if (targetTag === 'p' || targetTag === 'div') {
            const textIndent = firstLinePx - leftPx;
            target.style.textIndent = textIndent !== 0 ? `${textIndent}px` : '';
          }
        }
        emit();
      }
    },
    [emit],
  );

  /* ─────────────────────────────────────────────────────────────────
     Régua muda → aplica imediatamente
  ───────────────────────────────────────────────────────────────── */
  const handleRulerChange = useCallback(
    (m: IndentMarkers) => {
      setIndentMarkers(m);
      applyIndent(m.leftIndent, m.firstLine);
    },
    [applyIndent],
  );

  /* ─────────────────────────────────────────────────────────────────
     Link
  ───────────────────────────────────────────────────────────────── */
  const handleLink = useCallback(() => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    const selectedText = sel && !sel.isCollapsed ? sel.toString() : '';
    const url = window.prompt('URL do link:', 'https://');
    if (!url) return;
    if (selectedText) {
      exec('createLink', url);
    } else {
      const label = window.prompt('Texto do link:', url) || url;
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
      );
      emit();
    }
  }, [exec, emit]);

  /* ─────────────────────────────────────────────────────────────────
     Código inline
  ───────────────────────────────────────────────────────────────── */
  const handleCode = useCallback(() => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      document.execCommand(
        'insertHTML',
        false,
        '<code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.88em">código</code>',
      );
    } else {
      const range = sel.getRangeAt(0);
      const code = document.createElement('code');
      code.style.cssText =
        'background:#f0f0f0;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.88em';
      range.surroundContents(code);
    }
    emit();
  }, [emit]);

  /* ─────────────────────────────────────────────────────────────────
     Emoji
  ───────────────────────────────────────────────────────────────── */
  const handleEmoji = useCallback(() => {
    editorRef.current?.focus();
    const emoji = window.prompt('Cole ou digita um emoji:', '');
    if (emoji) exec('insertText', emoji);
  }, [exec]);

  /* ─────────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────────── */
  const minH = `${minRows * 1.65}rem`;

  const Divider = () => (
    <span className="inline-block w-px h-5 bg-gray-300 mx-1 align-middle" />
  );

  const Btn = ({
    title,
    onClick,
    children,
  }: {
    title: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // evita perder foco do editor
        onClick();
      }}
      className="p-1.5 rounded text-medway-dark hover:bg-gray-200 active:bg-gray-300 transition select-none"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-medway-primary">

      {/* ── Toolbar ── */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <Btn title="Negrito (Ctrl+B)" onClick={() => exec('bold')}>
          <span className="text-sm font-bold leading-none">B</span>
        </Btn>
        <Btn title="Itálico (Ctrl+I)" onClick={() => exec('italic')}>
          <em className="text-sm leading-none" style={{ fontStyle: 'italic' }}>I</em>
        </Btn>
        <Btn title="Sublinhado (Ctrl+U)" onClick={() => exec('underline')}>
          <span className="text-sm underline leading-none">U</span>
        </Btn>
        <Btn title="Tachado" onClick={() => exec('strikeThrough')}>
          <span className="text-sm line-through leading-none">S</span>
        </Btn>

        <Divider />

        <Btn title="Lista com marcadores" onClick={() => exec('insertUnorderedList')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="9" y="5" width="12" height="2" rx="1"/>
            <rect x="9" y="11" width="12" height="2" rx="1"/>
            <rect x="9" y="17" width="12" height="2" rx="1"/>
            <circle cx="5" cy="6" r="1.5"/>
            <circle cx="5" cy="12" r="1.5"/>
            <circle cx="5" cy="18" r="1.5"/>
          </svg>
        </Btn>
        <Btn title="Lista numerada" onClick={() => exec('insertOrderedList')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="9" y="5" width="12" height="2" rx="1"/>
            <rect x="9" y="11" width="12" height="2" rx="1"/>
            <rect x="9" y="17" width="12" height="2" rx="1"/>
            <text x="2.5" y="7.5" fontSize="5" fontWeight="bold" fill="currentColor">1</text>
            <text x="2.5" y="13.5" fontSize="5" fontWeight="bold" fill="currentColor">2</text>
            <text x="2.5" y="19.5" fontSize="5" fontWeight="bold" fill="currentColor">3</text>
          </svg>
        </Btn>

        <Divider />

        <Btn title="Inserir emoji" onClick={handleEmoji}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </Btn>
      </div>

      {/* ── Régua ── */}
      <RulerBar markers={indentMarkers} onChange={handleRulerChange} />

      {/* ── Área editável ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onClick={() => { saveRange(); readIndentFromCursor(); }}
        onKeyUp={() => { saveRange(); readIndentFromCursor(); }}
        onSelect={saveRange}
        style={{ minHeight: minH }}
        data-placeholder={placeholder}
        className={[
          'px-3 py-2 text-sm text-medway-text focus:outline-none leading-relaxed',
          'richtext-editor', // classe para os estilos globais de listas
          'empty:before:content-[attr(data-placeholder)]',
          'empty:before:text-gray-400',
          'empty:before:pointer-events-none',
        ].join(' ')}
      />
    </div>
  );
}
