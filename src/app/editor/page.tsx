'use client';

import React, { useState, useRef } from 'react';
import { useFicha } from '@/hooks/useFicha';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FormularioFicha } from '@/components/Editor/FormularioFicha';
import { FichaRenderer } from '@/components/Medway/FichaRenderer';
import { validarFichaMedway } from '@/services/validadorMedway';
import { exportarFichaPDF } from '@/services/exportadorPDF';
import { Ficha } from '@/types/ficha.types';

export default function EditorPage() {
  const { ficha, updateTitulo, updateSubtitulo, addSecao, updateSecao, removeSecao, setFicha } =
    useFicha();

  const [savedFichas, setSavedFichas, isLoaded] = useLocalStorage<Ficha[]>('fichas', []);
  const [validation, setValidation] = useState(validarFichaMedway(ficha));
  const [view, setView] = useState<'form' | 'preview'>('form');
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Update validation whenever ficha changes
  React.useEffect(() => {
    setValidation(validarFichaMedway(ficha));
  }, [ficha]);

  const handleSave = () => {
    const updatedFichas = [...savedFichas];
    const index = updatedFichas.findIndex((f) => f.id === ficha.id);

    if (index >= 0) {
      updatedFichas[index] = ficha;
    } else {
      updatedFichas.push(ficha);
    }

    setSavedFichas(updatedFichas);
    alert('Ficha salva com sucesso!');
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;

    try {
      setExporting(true);
      await exportarFichaPDF(ficha, previewRef.current);
      alert('PDF exportado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao exportar PDF');
    } finally {
      setExporting(false);
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-medway-light">
      {/* Header */}
      <header className="bg-medway-dark text-white px-6 py-4 shadow-medway">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Medway Fichas</h1>
          <div className="space-x-2 flex flex-wrap">
            <button
              onClick={handleSave}
              className="bg-medway-primary text-medway-dark font-semibold py-2 px-4 rounded-sm hover:bg-opacity-90 text-sm"
            >
              💾 Salvar
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-medway-secondary text-white font-semibold py-2 px-4 rounded-sm hover:bg-opacity-90 disabled:opacity-50 text-sm"
            >
              {exporting ? '⏳ Exportando...' : '📄 PDF'}
            </button>
            <a
              href="/"
              className="text-white hover:text-medway-light transition py-2 px-4 text-sm"
            >
              🏠 Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs para Mobile */}
        <div className="md:hidden flex gap-2 mb-4">
          <button
            onClick={() => setView('form')}
            className={`flex-1 py-2 px-4 rounded-sm font-semibold transition ${
              view === 'form'
                ? 'bg-medway-primary text-white'
                : 'bg-white text-medway-dark border border-gray-300'
            }`}
          >
            Formulário
          </button>
          <button
            onClick={() => setView('preview')}
            className={`flex-1 py-2 px-4 rounded-sm font-semibold transition ${
              view === 'preview'
                ? 'bg-medway-primary text-white'
                : 'bg-white text-medway-dark border border-gray-300'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulário (Esquerda) */}
          <div className={`${view !== 'form' && 'md:block hidden'}`}>
            <div className="bg-white rounded-md shadow-medway p-6">
              <FormularioFicha
                ficha={ficha}
                onUpdateTitulo={updateTitulo}
                onUpdateSubtitulo={updateSubtitulo}
                onAddSecao={addSecao}
                onUpdateSecao={updateSecao}
                onRemoveSecao={removeSecao}
              />
            </div>
          </div>

          {/* Preview (Direita) */}
          <div className={`${view !== 'preview' && 'md:block hidden'}`}>
            <div className="bg-white rounded-md shadow-medway p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div ref={previewRef}>
                <FichaRenderer ficha={ficha} preview />
              </div>
            </div>
          </div>
        </div>

        {/* Validador Medway */}
        <div className="mt-6 bg-white rounded-md shadow-medway p-6">
          <h2 className="text-xl font-bold text-medway-dark mb-4">
            Validação Medway Design System
          </h2>

          <div className="space-y-4">
            {/* Status */}
            <div
              className={`p-4 rounded-sm ${
                validation.conformeMedway
                  ? 'bg-green-50 border border-medway-success'
                  : 'bg-red-50 border border-medway-error'
              }`}
            >
              <p className="font-semibold">
                {validation.conformeMedway ? '✅ Conforme Medway' : '❌ Problemas encontrados'}
              </p>
            </div>

            {/* Erros */}
            {validation.erros.length > 0 && (
              <div className="bg-red-50 border border-medway-error p-4 rounded-sm">
                <p className="font-semibold text-medway-error mb-2">Erros:</p>
                <ul className="list-none pl-0 space-y-1">
                  {validation.erros.map((erro, idx) => (
                    <li key={idx} className="text-sm text-medway-text">
                      • {erro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Avisos */}
            {validation.avisos.length > 0 && (
              <div className="bg-yellow-50 border border-medway-warning p-4 rounded-sm">
                <p className="font-semibold text-medway-warning mb-2">Avisos:</p>
                <ul className="list-none pl-0 space-y-1">
                  {validation.avisos.map((aviso, idx) => (
                    <li key={idx} className="text-sm text-medway-text">
                      • {aviso}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
