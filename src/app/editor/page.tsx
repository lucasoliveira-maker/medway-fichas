'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFicha } from '@/hooks/useFicha';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FormularioFicha } from '@/components/Editor/FormularioFicha';
import { FichaRenderer } from '@/components/Medway/FichaRenderer';
import { validarFichaMedway } from '@/services/validadorMedway';
import { exportarFichaPDF } from '@/services/exportadorPDF';
import { Ficha } from '@/types/ficha.types';

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-medway-light">
        <p className="text-medway-gray font-montserrat">Carregando editor...</p>
      </div>
    }>
      <EditorConteudo />
    </Suspense>
  );
}

function EditorConteudo() {
  const searchParams = useSearchParams();
  const fichaId = searchParams.get('id');

  const { ficha, updateTitulo, updateSubtitulo, addSecao, addSecaoAt, updateSecao, removeSecao, setFicha } =
    useFicha();

  const [savedFichas, setSavedFichas, isLoaded] = useLocalStorage<Ficha[]>('fichas', []);
  const [validation, setValidation] = useState(validarFichaMedway(ficha));
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'validar'>('form');
  const [exporting, setExporting] = useState(false);
  const [fichaCarregada, setFichaCarregada] = useState(false);

  // Carrega ficha existente do localStorage quando editar
  useEffect(() => {
    if (isLoaded && fichaId && !fichaCarregada) {
      const encontrada = savedFichas.find((f) => f.id === fichaId);
      if (encontrada) {
        setFicha(encontrada);
        setFichaCarregada(true);
      }
    }
  }, [isLoaded, fichaId, savedFichas, fichaCarregada, setFicha]);

  useEffect(() => {
    setValidation(validarFichaMedway(ficha));
  }, [ficha]);

  const handleSave = () => {
    const atualizado = {
      ...ficha,
      validacao: { ...validation, validadoEm: new Date() },
      metadados: { ...ficha.metadados, atualizado: new Date() },
    };
    const lista = [...savedFichas];
    const idx = lista.findIndex((f) => f.id === ficha.id);
    if (idx >= 0) lista[idx] = atualizado;
    else lista.push(atualizado);
    setSavedFichas(lista);
    setFicha(atualizado);
    alert('Ficha salva com sucesso!');
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportarFichaPDF(ficha, document.body);
    } catch (error: any) {
      alert(error?.message || 'Erro ao exportar PDF. Permita popups para este site.');
    } finally {
      setExporting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-medway-light">
        <p className="text-medway-gray font-montserrat">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medway-light flex flex-col">

      {/* Header */}
      <header className="bg-medway-dark text-white px-6 py-3 shadow-medway sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4 flex-wrap">
          <div>
            <span className="text-xl font-bold font-montserrat">Medway Fichas</span>
            {fichaId && (
              <span className="ml-3 text-xs bg-medway-primary text-medway-dark px-2 py-0.5 rounded-full font-semibold">
                Editando
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleSave}
              className="bg-medway-primary text-medway-dark font-semibold py-2 px-4 rounded-sm text-sm hover:opacity-90 transition"
            >
              💾 Salvar
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-medway-secondary text-white font-semibold py-2 px-4 rounded-sm text-sm hover:opacity-90 disabled:opacity-50 transition"
            >
              {exporting ? '⏳...' : '📄 PDF'}
            </button>
            <a
              href="/"
              className="text-white/80 hover:text-white py-2 px-3 text-sm transition"
            >
              ← Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Tabs Mobile */}
      <div className="lg:hidden flex border-b border-gray-200 bg-white sticky top-[57px] z-10">
        {(['form', 'preview', 'validar'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold transition capitalize ${
              activeTab === tab
                ? 'border-b-2 border-medway-primary text-medway-primary'
                : 'text-medway-gray'
            }`}
          >
            {tab === 'form' ? 'Formulário' : tab === 'preview' ? 'Preview' : 'Validação'}
          </button>
        ))}
      </div>

      {/* Layout principal — sempre 2 colunas em desktop */}
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">

          {/* COLUNA ESQUERDA — Formulário */}
          <div className={activeTab !== 'form' ? 'hidden lg:block' : ''}>
            <div className="bg-white rounded-md shadow-medway p-6">
              <h2 className="text-lg font-bold text-medway-dark mb-4 font-montserrat">
                {fichaId ? '✏️ Editando Ficha' : '✨ Nova Ficha'}
              </h2>
              <FormularioFicha
                ficha={ficha}
                onUpdateTitulo={updateTitulo}
                onUpdateSubtitulo={updateSubtitulo}
                onAddSecao={addSecao}
                onAddSecaoAt={addSecaoAt}
                onUpdateSecao={updateSecao}
                onRemoveSecao={removeSecao}
              />
            </div>

            {/* Validador — abaixo do form no desktop */}
            <div className="mt-6 bg-white rounded-md shadow-medway p-5 hidden lg:block">
              <h3 className="font-bold text-medway-dark mb-3 text-sm">
                Validação Medway Design System
              </h3>
              <ValidationPanel validation={validation} />
            </div>
          </div>

          {/* COLUNA DIREITA — Preview sticky */}
          <div className={activeTab === 'preview' || activeTab === 'validar' ? '' : 'hidden lg:block'}>
            <div className="lg:sticky lg:top-[72px]">
              <div className="bg-white rounded-md shadow-medway p-8 overflow-y-auto max-h-[calc(100vh-120px)]">
                <FichaRenderer ficha={ficha} preview />
              </div>

              {/* Validador mobile */}
              {activeTab === 'validar' && (
                <div className="mt-4 bg-white rounded-md shadow-medway p-5 lg:hidden">
                  <h3 className="font-bold text-medway-dark mb-3 text-sm">
                    Validação Medway Design System
                  </h3>
                  <ValidationPanel validation={validation} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ValidationPanel({ validation }: { validation: ReturnType<typeof validarFichaMedway> }) {
  return (
    <div className="space-y-3">
      <div className={`px-4 py-3 rounded-sm text-sm font-semibold ${
        validation.conformeMedway
          ? 'bg-green-50 border border-medway-success text-medway-success'
          : 'bg-red-50 border border-medway-error text-medway-error'
      }`}>
        {validation.conformeMedway ? '✅ Conforme Medway' : '❌ Requer ajustes'}
      </div>

      {validation.erros.map((e, i) => (
        <p key={i} className="text-xs text-medway-error bg-red-50 px-3 py-2 rounded-sm">
          ❌ {e}
        </p>
      ))}
      {validation.avisos.map((a, i) => (
        <p key={i} className="text-xs text-medway-warning bg-yellow-50 px-3 py-2 rounded-sm">
          ⚠️ {a}
        </p>
      ))}
      {validation.conformeMedway && validation.avisos.length === 0 && (
        <p className="text-xs text-medway-gray">Nenhum problema encontrado.</p>
      )}
    </div>
  );
}
