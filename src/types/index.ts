// qmatica-frontend/src/types/index.ts

export interface Quiz {
  id_quiz?: string; // Es opcional porque al crear no tiene ID
  nombre: string;
  dificultad: number; // 1, 2, 3, 4
  cantidad_preguntas: number;
  tiempo_estimado: number;
  preguntas: string[]; // Array de IDs de preguntas
  // Si tu backend les añade, podrías incluir:
  // createdAt?: string;
  // updatedAt?: string;
}

export interface Categoria {
  id_categoria?: string;
  nombre: string;
  descripcion: string;
  id_super_cat?: string | null; // Nullable
}

export interface SuperCategoria {
  id_super_cat?: string;
  nombre: string;
  categorias: string[]; // Array de IDs de categorías
  paes: string;
}

// Puedes añadir una interfaz genérica para el estado inicial del formulario
export type DocumentData = Quiz | Categoria | SuperCategoria | {};

// Para la tabla, necesitamos saber qué columnas mostrar
export interface TableColumn {
  key: string;
  label: string;
}