import React, { useState, useEffect } from "react";
import { z } from "zod";

import {
  createQuiz,
  getQuizzes,
  getQuizByID,
  getQuizPreguntas,
  updateQuiz,
  deleteQuiz,
  createPregunta,
  getPreguntas,
  getPreguntaByID,
  updatePregunta,
  deletePregunta,
} from "../../../helpers/apiHelpers";

import { QuizModel } from "../../../models/QuizModel";
import { PreguntaModel } from "../../../models/PreguntaModel";

import {
  createQuizSchema,
  updateQuizSchema
} from "../../../schemas/quizSchemas";

import {
  createQuestionSchema,
  updateQuestionSchema,
  opcionesSchema
} from "../../../schemas/preguntaSchemas";

import DynamicFormCard from "./DynamicFormCard";
import DynamicTable from "./DynamicTable";
import Alert from "../../shared/Alert";

export const QuizzesCRUD = () => {
  // Estados para quizzes
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // Estados para preguntas
  const [preguntas, setPreguntas] = useState([]);
  const [selectedPregunta, setSelectedPregunta] = useState(null);
  
  // Estado general
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message, timeout = 5000) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);

    if (timeout) {
      setTimeout(() => removeAlert(id), timeout);
    }
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      const [quizzesData, preguntasData] = await Promise.all([
        getQuizzes(),
        getPreguntas()
      ]);
      setQuizzes(quizzesData);
      setPreguntas(preguntasData);
    } catch (error) {
      addAlert("error", "Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de quizzes
  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setSelectedPregunta(null); // Deseleccionar pregunta si había una seleccionada
  };

  const handleSaveQuiz = async () => {
    if (!selectedQuiz) return;

    setLoading(true);
    try {
      if (selectedQuiz.id_quiz) {
        // Actualizar quiz existente
        const { id_quiz, main_subcategory, ...dataToValidate } = selectedQuiz;
        const validatedData = updateQuizSchema.parse(dataToValidate);
        await updateQuiz(id_quiz, validatedData);
        addAlert("success", "Quiz actualizado correctamente");
      } else {
        // Crear nuevo quiz
        const validatedData = createQuizSchema.parse(selectedQuiz);
        await createQuiz(validatedData);
        addAlert("success", "Quiz creado correctamente");
      }
      
      loadData();
      setSelectedQuiz(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          addAlert("error", `${err.path.join(".")}: ${err.message}`);
        });
      } else {
        addAlert("error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    setLoading(true);
    try {
      await deleteQuiz(id);
      addAlert("success", "Quiz eliminado correctamente");
      loadData();
      if (selectedQuiz?.id_quiz === id) {
        setSelectedQuiz(null);
      }
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de preguntas
  const handleSelectPregunta = (pregunta) => {
    setSelectedPregunta(pregunta);
    setSelectedQuiz(null); // Deseleccionar quiz si había uno seleccionado
  };

  const handleSavePregunta = async () => {
    if (!selectedPregunta) return;

    setLoading(true);
    try {
      // Validar opciones primero
      const opcionesValidadas = opcionesSchema.parse(selectedPregunta.opciones);
      
      if (selectedPregunta.id_pregunta) {
        // Actualizar pregunta existente
        const { id_pregunta, ...dataToValidate } = selectedPregunta;
        const validatedData = updateQuestionSchema.parse({
          ...dataToValidate,
          opciones: opcionesValidadas
        });
        await updatePregunta(id_pregunta, validatedData);
        addAlert("success", "Pregunta actualizada correctamente");
      } else {
        // Crear nueva pregunta
        const validatedData = createQuestionSchema.parse({
          enunciado: selectedPregunta.enunciado,
          dificultad: selectedPregunta.dificultad,
          opciones: opcionesValidadas,
          id_subcategoria: selectedPregunta.id_subcategoria,
        });
        await createPregunta(validatedData);
        addAlert("success", "Pregunta creada correctamente");
      }
      
      loadData();
      setSelectedPregunta(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          addAlert("error", `${err.path.join(".")}: ${err.message}`);
        });
      } else {
        addAlert("error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePregunta = async (id) => {
    setLoading(true);
    try {
      await deletePregunta(id);
      addAlert("success", "Pregunta eliminada correctamente");
      loadData();
      if (selectedPregunta?.id_pregunta === id) {
        setSelectedPregunta(null);
      }
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Mostrar alertas */}
      <div className="space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      {/* Sección de formularios */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Formulario de quiz */}
        <div className="flex-1 card bg-base-200 p-4">
          <h2 className="text-xl font-bold mb-4">
            {selectedQuiz?.id_quiz ? "Editar Quiz" : "Crear Nuevo Quiz"}
          </h2>
          <DynamicFormCard
            model={QuizModel}
            data={selectedQuiz || {}}
            onDataChange={setSelectedQuiz}
          />
          {selectedQuiz && (
            <div className="flex space-x-2 mt-4">
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleSaveQuiz}
                disabled={loading}
              >
                Guardar Cambios
              </button>
              <button
                className="btn"
                onClick={() => setSelectedQuiz(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Formulario de preguntas */}
        <div className="flex-1 card bg-base-200 p-4">
          <h2 className="text-xl font-bold mb-4">
            {selectedPregunta?.id_pregunta ? "Editar Pregunta" : "Crear Nueva Pregunta"}
          </h2>
          <DynamicFormCard
            model={PreguntaModel}
            data={selectedPregunta || {}}
            onDataChange={setSelectedPregunta}
          />
          {selectedPregunta && (
            <div className="flex space-x-2 mt-4">
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleSavePregunta}
                disabled={loading}
              >
                Guardar Pregunta
              </button>
              <button
                className="btn"
                onClick={() => setSelectedPregunta(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de quizzes */}
      <div className="card bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Quizzes</h2>
        <button
          className={`btn mb-4 ${loading ? "loading" : ""}`}
          onClick={loadData}
          disabled={loading}
        >
          Actualizar Lista
        </button>
        <DynamicTable
          model={QuizModel}
          data={quizzes}
          onEdit={handleSelectQuiz}
          onDelete={handleDeleteQuiz}
          uniqueKeyField="id_quiz"
          itemsPerPage={5}
        />
      </div>

      {/* Tabla de preguntas */}
      <div className="card bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Preguntas</h2>
        <button
          className={`btn mb-4 ${loading ? "loading" : ""}`}
          onClick={loadData}
          disabled={loading}
        >
          Actualizar Lista
        </button>
        <DynamicTable
          model={PreguntaModel}
          data={preguntas}
          onEdit={handleSelectPregunta}
          onDelete={handleDeletePregunta}
          uniqueKeyField="id_pregunta"
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};