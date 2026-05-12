'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface IndentMarkers {
  /** 0..1 fraction of ruler width — left indent (bullets / continuação de linha) */
  leftIndent: number;
  /** 0..1 fraction — recuo da primeira linha (pode ser < leftIndent para recuo negativo) */
  firstLine: number;
}

interface RulerBarProps {
  markers: IndentMarkers;
  onChange: (m: IndentMarkers) => void;
}

const TOTAL_UNITS = 18;
const H = 30; // ruler height px
const MAX_FRACTION = 0.75; // block no máximo 75% da largura

export function RulerBar({ markers, onChange }: RulerBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(500);

  /* ── Mede largura e re-mede ao redimensionar ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setW(Math.max(1, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Drag handler genérico ── */
  const startDrag = useCallback(
    (key: keyof IndentMarkers, e: React.MouseEvent) => {
      e.preventDefault(); // não tira o foco do editor
      e.stopPropagation();
      const startX = e.clientX;
      const startVal = markers[key];

      const onMove = (ev: MouseEvent) => {
        const delta = (ev.clientX - startX) / W;
        const raw = startVal + delta;
        // leftIndent: 0..MAX  |  firstLine: pode ir até o mesmo MAX
        const clamped = Math.max(0, Math.min(MAX_FRACTION, raw));
        onChange({ ...markers, [key]: clamped });
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [markers, onChange, W],
  );

  /* ── Gera marcas de escala ── */
  const ticks: React.ReactNode[] = [];
  const halfSteps = TOTAL_UNITS * 2;
  for (let i = 0; i <= halfSteps; i++) {
    const x = (i / halfSteps) * W;
    const major = i % 2 === 0;
    const unit = i / 2;
    ticks.push(
      <g key={`tk${i}`}>
        <line
          x1={x} y1={2}
          x2={x} y2={major ? 12 : 8}
          stroke={major ? '#aaa' : '#d1d5db'}
          strokeWidth={major ? 1 : 0.7}
        />
        {major && unit > 0 && (
          <text
            x={x} y={H - 3}
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="system-ui, sans-serif"
            fill="#9ca3af"
          >
            {unit}
          </text>
        )}
      </g>,
    );
  }

  const lx = markers.leftIndent * W;  // left-indent x
  const fx = markers.firstLine * W;   // first-line x

  return (
    <div
      ref={containerRef}
      title="Arraste ▼ para recuo da 1ª linha  |  Arraste ▲ para recuo dos bullets"
      style={{
        width: '100%',
        height: H,
        background: '#f5f5f5',
        borderBottom: '1px solid #d1d5db',
        userSelect: 'none',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <svg
        width={W}
        height={H}
        style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
      >
        {/* fundo */}
        <rect x={0} y={0} width={W} height={H} fill="#f5f5f5" />

        {/* linhas de escala + números */}
        {ticks}

        {/* ── Marcador primeira linha ▼ (topo, aponta para baixo) ── */}
        <g
          transform={`translate(${fx}, 0)`}
          style={{ cursor: 'ew-resize' }}
          onMouseDown={(e) => startDrag('firstLine', e)}
        >
          {/* triângulo apontando para baixo */}
          <polygon points="-5,0 5,0 0,10" fill="#1862BC" opacity="0.85" />
          <title>Recuo de primeira linha — arraste</title>
        </g>

        {/* ── Marcador recuo esquerdo ▲ (base, aponta para cima) ── */}
        <g
          transform={`translate(${lx}, ${H})`}
          style={{ cursor: 'ew-resize' }}
          onMouseDown={(e) => startDrag('leftIndent', e)}
        >
          {/* triângulo apontando para cima */}
          <polygon points="-5,0 5,0 0,-10" fill="#00205B" opacity="0.85" />
          <title>Recuo à esquerda (bullets) — arraste</title>
        </g>
      </svg>
    </div>
  );
}
