import React, { useState, useEffect } from 'react';
import Footer from "../../shared/Footer";
import main5 from "../../../assets/images/main5.png";

// Componente para mostrar un solo quiz
const QuizCard = ({ quiz }) => {
  const isPremiumLocked = quiz.dificultad === 4; // Asumimos dificultad 4 es el máximo

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${quiz.colorClass || ''} relative`}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{quiz.nombre}</h3>
        <p className="text-sm text-gray-600 mt-1">{quiz.descripcionCategoria}</p> {/* Asumiendo esta prop */}
        <p className="text-gray-500 text-xs mt-2">{quiz.cantidad_preguntas} preguntas</p>
        <p className="text-gray-500 text-xs">Tiempo estimado: {quiz.tiempo_estimado} min</p>
      </div>
      <div className="flex justify-end p-4 bg-gray-100 items-center">
        {isPremiumLocked ? (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <span className="text-white font-semibold text-sm text-center px-4">
              Debes ser nivel Plata o superior para hacer este quiz
            </span>
          </div>
        ) : (
          <>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm">
              Ver temario
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
};

// Componente para la lista de categorías
const CategoriesList = ({ categories }) => {
  return (
    <aside className="bg-white p-4 border rounded-md shadow-md w-full md:w-1/4 mb-6 md:mb-0 md:mr-8">
      <h2 className="text-xl font-semibold mb-4">Categorías</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id_categoria}>
            <a href={`/quizzes?categoria=${category.id_categoria}`} className="hover:text-blue-500">
              {category.nombre}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default function QuizzesList() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorQuizzes, setErrorQuizzes] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);

  useEffect(() => {
    // Función para obtener los quizzes desde la base de datos
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes'); // Reemplaza '/api/quizzes' con tu endpoint real
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuizzes(data);
        setLoadingQuizzes(false);
      } catch (error) {
        setErrorQuizzes(error);
        setLoadingQuizzes(false);
        console.error("Error fetching quizzes:", error);
      }
    };

    // Función para obtener las categorías desde la base de datos
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorias'); // Reemplaza '/api/categorias' con tu endpoint real
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        setLoadingCategories(false);
      } catch (error) {
        setErrorCategories(error);
        setLoadingCategories(false);
        console.error("Error fetching categories:", error);
      }
    };

    fetchQuizzes();
    fetchCategories();
  }, []);

  if (loadingQuizzes || loadingCategories) {
    return <div>Cargando quizzes y categorías...</div>;
  }

  if (errorQuizzes || errorCategories) {
    return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div
        className="w-full h-40 md:h-56 lg:h-64 bg-cover bg-center relative mb-6"
        style={{ backgroundImage: `url(${main5})` }}
      >
        <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center px-4">
          <input
            type="text"
            placeholder="Buscar quizzes..."
            className="w-full md:w-2/3 lg:w-1/2 px-4 py-2 border border-white rounded shadow text-black bg-white focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="container mx-auto py-6 flex flex-col md:flex-row px-4 md:px-8">
        <CategoriesList categories={categories} />

        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Quizzes</h1>
          <p className="text-gray-600 mb-4">Mostrando {quizzes.length} resultados</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id_quiz} quiz={quiz} />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}