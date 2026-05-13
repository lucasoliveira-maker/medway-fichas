'use client';

import { useState, useCallback } from 'react';

interface UseUndoReturn<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MAX_HISTORY = 50; // Máximo de estados no histórico

export function useUndo<T>(initialState: T): UseUndoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback((newState: T) => {
    setHistory((prev) => {
      // Remove qualquer estado "redo" quando uma nova ação é feita
      const newHistory = prev.slice(0, currentIndex + 1);
      // Adiciona o novo estado
      newHistory.push(newState);
      // Limita o tamanho do histórico
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prev) => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
