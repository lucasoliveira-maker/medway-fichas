'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Digite o parágrafo...',
  minRows = 4,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const suppressSync = useRef(false);

  /* ── Sync external value → DOM (only when it truly differs, e.g. load) ── */
  useEffect(() => {
    if (!editorRef.current) return;
    if (suppressSync.current) {
      suppressSync.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value ?? '';
    }
  }, [value]);

  /* ── Emit changes to parent ── */
  const emit = useCallback(() => {
    if (!editorRef.current) return;
    suppressSync.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  /* ── execCommand wrapper ── */
  const exec = useCallback(
    (cmd: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val ?? undefined);
      emit();
    },
    [emit],
  );

  /* ── Link ── */
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

  /* ── Inline code ── */
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

  /* ── Emoji picker (simple prompt fallback) ── */
  const handleEmoji = useCallback(() => {
    editorRef.current?.focus();
    const emoji = window.prompt('Cole ou digita um emoji:', '');
    if (emoji) exec('insertText', emoji);
  }, [exec]);

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
        e.preventDefault(); // prevent blur before exec
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
          <em className="text-sm leading-none not-italic" style={{ fontStyle: 'italic' }}>I</em>
        </Btn>
        <Btn title="Sublinhado (Ctrl+U)" onClick={() => exec('underline')}>
          <span className="text-sm underline leading-none">U</span>
        </Btn>
        <Btn title="Tachado" onClick={() => exec('strikeThrough')}>
          <span className="text-sm line-through leading-none">S</span>
        </Btn>

        <Divider />

        <Btn title="Inserir link" onClick={handleLink}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
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
            <text x="3" y="7.5" fontSize="5" fontWeight="bold" fill="currentColor">1</text>
            <text x="3" y="13.5" fontSize="5" fontWeight="bold" fill="currentColor">2</text>
            <text x="3" y="19.5" fontSize="5" fontWeight="bold" fill="currentColor">3</text>
          </svg>
        </Btn>

        <Divider />

        <Btn title="Alinhar à esquerda" onClick={() => exec('justifyLeft')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="2" rx="1"/>
            <rect x="3" y="9" width="12" height="2" rx="1"/>
            <rect x="3" y="13" width="18" height="2" rx="1"/>
            <rect x="3" y="17" width="12" height="2" rx="1"/>
          </svg>
        </Btn>
        <Btn title="Centralizar" onClick={() => exec('justifyCenter')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="2" rx="1"/>
            <rect x="6" y="9" width="12" height="2" rx="1"/>
            <rect x="3" y="13" width="18" height="2" rx="1"/>
            <rect x="6" y="17" width="12" height="2" rx="1"/>
          </svg>
        </Btn>
        <Btn title="Alinhar à direita" onClick={() => exec('justifyRight')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="2" rx="1"/>
            <rect x="9" y="9" width="12" height="2" rx="1"/>
            <rect x="3" y="13" width="18" height="2" rx="1"/>
            <rect x="9" y="17" width="12" height="2" rx="1"/>
          </svg>
        </Btn>

        <Divider />

        <Btn title="Código inline" onClick={handleCode}>
          <span className="text-xs font-mono leading-none">&lt;/&gt;</span>
        </Btn>

        <Btn title="Inserir emoji" onClick={handleEmoji}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </Btn>
      </div>

      {/* ── Editable area ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        style={{ minHeight: minH }}
        data-placeholder={placeholder}
        className={[
          'px-3 py-2 text-sm text-medway-text focus:outline-none',
          'leading-relaxed',
          /* placeholder via CSS when empty */
          'empty:before:content-[attr(data-placeholder)]',
          'empty:before:text-gray-400',
          'empty:before:pointer-events-none',
        ].join(' ')}
      />
    </div>
  );
}
