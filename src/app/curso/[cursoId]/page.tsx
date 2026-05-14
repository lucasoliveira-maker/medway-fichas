'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Curso } from '@/types/curso.types';
import { Ficha } from '@/types/ficha.types';

export default function CursoFichasPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-medway-light">
        <p className="text-medway-gray font-montserrat">Carregando...</p>
      </div>
    }>
      <CursoFichasConteudo />
    </Suspense>
  );
}

function CursoFichasConteudo() {
  const { cursoId } = useParams<{ cursoId: string }>();
  const [cursos] = useLocalStorage<Curso[]>('cursos', []);
  const [fichas, setFichas, isLoaded] = useLocalStorage<Ficha[]>('fichas', []);

  const curso = cursos.find((c) => c.id === cursoId);
  const fichasDoCurso = fichas.filter((f) => f.cursoId === cursoId);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta ficha?')) {
      setFichas(fichas.filter((f) => f.id !== id));
    }
  };

  const handleDuplicate = (ficha: Ficha) => {
    const novaFicha: Ficha = {
      ...ficha,
      id: uuidv4(),
      titulo: `${ficha.titulo} (Cópia)`,
      metadados: {
        ...ficha.metadados,
        criado: new Date(),
        atualizado: new Date(),
      },
    };
    setFichas([...fichas, novaFicha]);
    alert('Ficha duplicada!');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-medway-light">
        <p className="text-medway-gray font-montserrat">Carregando...</p>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-medway-light flex flex-col items-center justify-center gap-4">
        <p className="text-medway-error font-semibold">Curso não encontrado.</p>
        <Link href="/" className="text-medway-primary hover:underline text-sm">
          ← Voltar para Cursos
        </Link>
      </div>
    );
  }

  const corCurso = curso.cor;

  return (
    <div className="min-h-screen bg-medway-light flex flex-col">
      {/* Header */}
      <header className="bg-medway-dark text-white px-6 py-0 shadow-medway sticky top-0 z-10">
        {/* Barra colorida no topo */}
        <div className="h-1 w-full -mx-6" style={{ backgroundColor: corCurso, marginTop: 0 }} />
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-white/60 hover:text-white text-sm transition"
            >
              ← Cursos
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-xl mr-1">{curso.icone}</span>
            <h1 className="font-bold text-lg font-montserrat">{curso.nome}</h1>
            {curso.descricao && (
              <span className="text-white/50 text-sm hidden md:inline">— {curso.descricao}</span>
            )}
          </div>
          <Link
            href={`/editor?curso=${cursoId}`}
            className="font-bold py-2 px-5 rounded-sm hover:opacity-90 transition text-sm"
            style={{ backgroundColor: corCurso, color: '#ffffff' }}
          >
            + Nova Ficha
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">

        {/* Contador */}
        <div className="mb-6">
          <p className="text-medway-gray text-sm">
            {fichasDoCurso.length === 0
              ? 'Nenhuma ficha criada neste curso ainda'
              : `${fichasDoCurso.length} ficha${fichasDoCurso.length > 1 ? 's' : ''} neste curso`}
          </p>
        </div>

        {/* Lista de fichas */}
        {fichasDoCurso.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{curso.icone}</div>
            <p className="text-medway-gray text-lg mb-2">Nenhuma ficha neste curso.</p>
            <p className="text-medway-gray text-sm mb-6">Crie a primeira ficha para {curso.nome}.</p>
            <Link
              href={`/editor?curso=${cursoId}`}
              className="inline-block text-medway-dark font-bold py-2.5 px-6 rounded-sm hover:opacity-90 transition text-sm"
              style={{ backgroundColor: corCurso }}
            >
              + Criar Primeira Ficha
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fichasDoCurso.map((ficha) => (
              <div
                key={ficha.id}
                className="bg-white rounded-md shadow-medway hover:shadow-medway-lg transition-shadow overflow-hidden flex flex-col"
              >
                {/* Barra colorida */}
                <div className="h-1.5 w-full" style={{ backgroundColor: corCurso }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Título */}
                  <h2 className="text-base font-bold text-medway-dark font-montserrat mb-1 truncate">
                    {ficha.titulo}
                  </h2>
                  {ficha.subtitulo && (
                    <p className="text-medway-gray text-xs mb-3 line-clamp-2">{ficha.subtitulo}</p>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-medway-gray mb-3 space-y-0.5">
                    <p>Tipo: <span className="font-semibold">{ficha.metadados.tipo}</span></p>
                    <p>Criado: {new Date(ficha.metadados.criado).toLocaleDateString('pt-BR')}</p>
                    <p>Seções: {ficha.secoes.length}</p>
                  </div>

                  {/* Validação */}
                  <div className="mb-4">
                    {ficha.validacao.conformeMedway ? (
                      <span className="inline-block bg-green-100 text-medway-success text-xs font-semibold px-2.5 py-1 rounded-full">
                        ✅ Conforme
                      </span>
                    ) : (
                      <span className="inline-block bg-red-100 text-medway-error text-xs font-semibold px-2.5 py-1 rounded-full">
                        ❌ Revisar
                      </span>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="mt-auto space-y-2">
                    <Link
                      href={`/editor?id=${ficha.id}&curso=${cursoId}`}
                      className="block w-full text-center font-semibold py-2 px-4 rounded-sm hover:opacity-90 transition text-sm"
                      style={{ backgroundColor: corCurso, color: '#ffffff' }}
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDuplicate(ficha)}
                      className="w-full border border-gray-200 text-medway-gray font-semibold py-2 px-4 rounded-sm hover:bg-gray-50 transition text-sm"
                    >
                      📋 Duplicar
                    </button>

                    <button
                      onClick={() => handleDelete(ficha.id)}
                      className="w-full text-medway-error border border-red-200 py-2 px-4 rounded-sm hover:bg-red-50 transition text-sm font-semibold"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-medway-dark text-white px-6 py-5">
        <div className="max-w-7xl mx-auto text-center text-xs text-white/60">
          Medway Fichas • {curso.nome} • © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
