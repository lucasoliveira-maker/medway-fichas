'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Ficha } from '@/types/ficha.types';

export default function DashboardPage() {
  const [fichas, setFichas, isLoaded] = useLocalStorage<Ficha[]>('fichas', []);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta ficha?')) {
      setFichas(fichas.filter((f) => f.id !== id));
    }
  };

  const handleDuplicate = (ficha: Ficha) => {
    const novaFicha = {
      ...ficha,
      id: Math.random().toString(),
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
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-medway-light">
      {/* Header */}
      <header className="bg-medway-dark text-white px-6 py-6 shadow-medway">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Medway Fichas</h1>
          <p className="text-medway-light text-lg">
            Plataforma de geração de fichas de educação médica
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* CTA Button */}
        <div className="mb-8">
          <Link
            href="/editor"
            className="inline-block bg-medway-primary text-medway-dark font-bold py-3 px-8 rounded-sm hover:bg-opacity-90 shadow-medway transition"
          >
            ➕ Criar Nova Ficha
          </Link>
        </div>

        {/* Fichas Grid */}
        {fichas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-medway-gray text-lg mb-4">Nenhuma ficha criada ainda.</p>
            <Link
              href="/editor"
              className="text-medway-primary font-semibold hover:underline"
            >
              Crie a sua primeira ficha agora
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fichas.map((ficha) => (
              <div
                key={ficha.id}
                className="bg-white rounded-sm shadow-medway p-6 hover:shadow-medway-lg transition"
              >
                {/* Título */}
                <h2 className="text-xl font-bold text-medway-dark mb-2 truncate">
                  {ficha.titulo}
                </h2>

                {/* Subtítulo */}
                {ficha.subtitulo && (
                  <p className="text-medway-text text-sm mb-3 line-clamp-2">
                    {ficha.subtitulo}
                  </p>
                )}

                {/* Metadata */}
                <div className="text-xs text-medway-gray mb-4 space-y-1">
                  <p>Tipo: <span className="font-semibold">{ficha.metadados.tipo}</span></p>
                  <p>Criado: {new Date(ficha.metadados.criado).toLocaleDateString('pt-BR')}</p>
                  <p>Seções: {ficha.secoes.length}</p>
                </div>

                {/* Status Validação */}
                <div className="mb-4">
                  {ficha.validacao.conformeMedway ? (
                    <span className="inline-block bg-green-100 text-medway-success text-xs font-semibold px-3 py-1 rounded-full">
                      ✅ Conforme
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-medway-error text-xs font-semibold px-3 py-1 rounded-full">
                      ❌ Revisar
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    href={`/editor?id=${ficha.id}`}
                    className="block w-full text-center bg-medway-primary text-medway-dark font-semibold py-2 px-4 rounded-sm hover:bg-opacity-90 transition text-sm"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => handleDuplicate(ficha)}
                    className="w-full border border-medway-primary text-medway-primary font-semibold py-2 px-4 rounded-sm hover:bg-medway-light transition text-sm"
                  >
                    📋 Duplicar
                  </button>
                  <button
                    onClick={() => handleDelete(ficha.id)}
                    className="w-full text-medway-error border border-medway-error py-2 px-4 rounded-sm hover:bg-red-50 transition text-sm font-semibold"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-medway-dark text-white px-6 py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-medway-light">
          <p>
            Medway Fichas • Plataforma de Educação Médica • © 2026 • Alinhado com Medway Design System v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
