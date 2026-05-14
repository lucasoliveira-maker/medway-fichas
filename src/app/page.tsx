'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Curso } from '@/types/curso.types';
import { Ficha } from '@/types/ficha.types';

const CORES = [
  '#01CFAB', '#1862BC', '#00205B', '#28A745',
  '#FF6B35', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444',
];

const ICONES = ['📚', '🏥', '🧬', '💊', '🔬', '🩺', '🧠', '❤️', '🦷', '🎓', '📋', '⚕️'];

const FORM_VAZIO = { nome: '', descricao: '', cor: CORES[0], icone: ICONES[0] };

export default function CursosPage() {
  const [cursos, setCursos, cursosLoaded] = useLocalStorage<Curso[]>('cursos', []);
  const [fichas] = useLocalStorage<Ficha[]>('fichas', []);

  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(FORM_VAZIO);

  if (!cursosLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-medway-light">
        <p className="text-medway-gray font-montserrat">Carregando...</p>
      </div>
    );
  }

  const fichasSemCurso = fichas.filter((f) => !f.cursoId);

  const fichasDoCurso = (cursoId: string) =>
    fichas.filter((f) => f.cursoId === cursoId);

  const handleSalvar = () => {
    if (!form.nome.trim()) return;
    const now = new Date();
    if (editandoId) {
      setCursos(cursos.map((c) =>
        c.id === editandoId ? { ...c, ...form, atualizado: now } : c
      ));
      setEditandoId(null);
    } else {
      const novo: Curso = {
        id: uuidv4(),
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || undefined,
        cor: form.cor,
        icone: form.icone,
        criado: now,
        atualizado: now,
      };
      setCursos([...cursos, novo]);
    }
    setForm(FORM_VAZIO);
    setShowForm(false);
  };

  const handleEditar = (curso: Curso) => {
    setForm({
      nome: curso.nome,
      descricao: curso.descricao || '',
      cor: curso.cor,
      icone: curso.icone,
    });
    setEditandoId(curso.id);
    setShowForm(true);
  };

  const handleDeletar = (id: string) => {
    const total = fichasDoCurso(id).length;
    const msg = total > 0
      ? `Este curso tem ${total} ficha(s). Ao deletar o curso elas ficarão sem curso. Continuar?`
      : 'Tem certeza que deseja deletar este curso?';
    if (confirm(msg)) {
      setCursos(cursos.filter((c) => c.id !== id));
    }
  };

  const handleCancelar = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-medway-light flex flex-col">
      {/* Header */}
      <header className="bg-medway-dark text-white px-6 py-6 shadow-medway">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold font-montserrat mb-1">Medway Fichas</h1>
          <p className="text-white/70 text-sm">Plataforma de geração de fichas de educação médica</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 py-10 flex-1">

        {/* Título + botão */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-medway-dark font-montserrat">Meus Cursos</h2>
            <p className="text-medway-gray text-sm mt-1">
              {cursos.length === 0
                ? 'Nenhum curso criado ainda'
                : `${cursos.length} curso${cursos.length > 1 ? 's' : ''}`}
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-medway-primary text-medway-dark font-bold py-2.5 px-6 rounded-sm hover:opacity-90 transition text-sm shadow-medway"
            >
              + Novo Curso
            </button>
          )}
        </div>

        {/* Formulário criar/editar curso */}
        {showForm && (
          <div className="bg-white rounded-md shadow-medway p-6 mb-8 border-l-4 border-medway-primary">
            <h3 className="font-bold text-medway-dark mb-4 text-base">
              {editandoId ? 'Editar Curso' : 'Novo Curso'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-medway-dark mb-1">
                  Nome do Curso *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
                  placeholder="Ex: Cardiologia, Clínica Médica..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-medway-dark mb-1">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-medway-primary"
                  placeholder="Breve descrição do curso"
                />
              </div>
            </div>

            {/* Ícone */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-medway-dark mb-2">Ícone</label>
              <div className="flex flex-wrap gap-2">
                {ICONES.map((icone) => (
                  <button
                    key={icone}
                    type="button"
                    onClick={() => setForm({ ...form, icone })}
                    className={`w-9 h-9 text-lg rounded-sm border-2 transition ${
                      form.icone === icone
                        ? 'border-medway-primary bg-medway-primary/10'
                        : 'border-gray-200 hover:border-medway-primary/50'
                    }`}
                  >
                    {icone}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-medway-dark mb-2">Cor do Curso</label>
              <div className="flex flex-wrap gap-2">
                {CORES.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setForm({ ...form, cor })}
                    style={{ backgroundColor: cor }}
                    className={`w-8 h-8 rounded-full border-4 transition ${
                      form.cor === cor ? 'border-medway-dark scale-110' : 'border-transparent hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSalvar}
                disabled={!form.nome.trim()}
                className="bg-medway-primary text-medway-dark font-bold py-2 px-6 rounded-sm hover:opacity-90 disabled:opacity-40 transition text-sm"
              >
                {editandoId ? 'Salvar Alterações' : 'Criar Curso'}
              </button>
              <button
                onClick={handleCancelar}
                className="border border-gray-300 text-medway-gray py-2 px-4 rounded-sm hover:bg-gray-50 transition text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Grid de cursos */}
        {cursos.length === 0 && !showForm ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-medway-gray text-lg mb-2">Nenhum curso criado ainda.</p>
            <p className="text-medway-gray text-sm mb-6">Crie seu primeiro curso para organizar suas fichas.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-medway-primary text-medway-dark font-bold py-2.5 px-6 rounded-sm hover:opacity-90 transition text-sm"
            >
              + Criar Primeiro Curso
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cursos.map((curso) => {
              const totalFichas = fichasDoCurso(curso.id).length;
              return (
                <div
                  key={curso.id}
                  className="bg-white rounded-md shadow-medway hover:shadow-medway-lg transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Barra de cor no topo */}
                  <div className="h-2 w-full" style={{ backgroundColor: curso.cor }} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Ícone + nome */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl leading-none">{curso.icone}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-medway-dark text-base font-montserrat truncate">
                          {curso.nome}
                        </h3>
                        {curso.descricao && (
                          <p className="text-medway-gray text-xs mt-0.5 line-clamp-2">
                            {curso.descricao}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contador */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${curso.cor}22`, color: curso.cor }}
                      >
                        {totalFichas} {totalFichas === 1 ? 'ficha' : 'fichas'}
                      </span>
                    </div>

                    {/* Ações */}
                    <div className="mt-auto space-y-2">
                      <Link
                        href={`/curso/${curso.id}`}
                        className="block w-full text-center font-semibold py-2 px-4 rounded-sm hover:opacity-90 transition text-sm"
                        style={{ backgroundColor: curso.cor, color: '#ffffff' }}
                      >
                        Abrir Curso →
                      </Link>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditar(curso)}
                          className="flex-1 border border-gray-200 text-medway-gray py-1.5 rounded-sm text-xs hover:bg-gray-50 transition"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeletar(curso.id)}
                          className="flex-1 border border-red-200 text-medway-error py-1.5 rounded-sm text-xs hover:bg-red-50 transition"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fichas sem curso (legado) */}
        {fichasSemCurso.length > 0 && (
          <div className="mt-10 p-4 bg-yellow-50 border border-yellow-200 rounded-sm text-sm text-yellow-800">
            <span className="font-semibold">⚠️ {fichasSemCurso.length} ficha(s) sem curso</span>
            {' — '}estas fichas foram criadas antes da organização por cursos e não pertencem a nenhum curso.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-medway-dark text-white px-6 py-5">
        <div className="max-w-7xl mx-auto text-center text-xs text-white/60">
          Medway Fichas • Plataforma de Educação Médica • © {new Date().getFullYear()} • Medway Design System v1.0
        </div>
      </footer>
    </div>
  );
}
