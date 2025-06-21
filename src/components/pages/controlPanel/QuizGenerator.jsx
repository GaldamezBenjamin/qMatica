import React, { useEffect, useState } from "react";
import {
  getSubCategorias,
  generateQuizzes,
  generatePreguntas,
  uploadQuizzesAndQuestions, // <-- importar el método
} from "../../../helpers/apiHelpers";
import { ChevronRight, Loader2, Check } from "lucide-react";

// Opciones de dificultad
const DIFFICULTY_OPTIONS = [
  { label: "Baja", value: "baja" },
  { label: "Media", value: "media" },
  { label: "Alta", value: "alta" },
  { label: "Muy Alta", value: "muy alta" },
];

export const QuizGenerator = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [quizCount, setQuizCount] = useState(1);
  const [generatedQuizzes, setGeneratedQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Panel de generación de preguntas
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [questionRange, setQuestionRange] = useState([3, 10]);

  // Estado para la respuesta y loading de generación de preguntas
  const [preguntasResponse, setPreguntasResponse] = useState(null);
  const [preguntasLoading, setPreguntasLoading] = useState(false);
  const [preguntasError, setPreguntasError] = useState("");
  const [selectedPreguntas, setSelectedPreguntas] = useState({});

  // Estado para sliders independientes
  const [minQuestions, setMinQuestions] = useState(3);
  const [maxQuestions, setMaxQuestions] = useState(8);
  const [selectedQuizzesToUpload, setSelectedQuizzesToUpload] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Cargar subcategorías al montar
  useEffect(() => {
    getSubCategorias().then(setSubcategories);
  }, []);

  // Mantener consistencia entre sliders
  useEffect(() => {
    if (minQuestions > maxQuestions) setMaxQuestions(minQuestions);
    if (maxQuestions < minQuestions) setMinQuestions(maxQuestions);
  }, [minQuestions, maxQuestions]);

  // Generar quizzes usando generateQuizzes de apiHelpers
  const handleGenerateQuizzes = async () => {
    setLoading(true);
    setError("");
    try {
      const subcatObj = subcategories.find(
        (s) => String(s.id_subcategoria) === String(selectedSubcategory)
      );
      const subcatNombre = subcatObj ? subcatObj.nombre : "";
      const subcatId = subcatObj ? subcatObj.id_subcategoria : "";

      const data = {
        subcategoria: subcatNombre,
        cantidad: quizCount,
      };
      const response = await generateQuizzes(data);
      const quizzes = (response.quizzes || response.data || []).map((q) => ({
        ...q,
        data: q.data ? { ...q.data, id_subcategoria: subcatId } : q.data,
      }));
      setGeneratedQuizzes(quizzes);
      setAllQuizzes((prev) => [
        ...prev,
        ...quizzes.map((q) => ({
          ...q,
          _localId: Math.random().toString(36).slice(2),
        })),
      ]);
    } catch (err) {
      setError(err?.message || "Ocurrió un error inesperado al generar quizzes.");
    } finally {
      setLoading(false);
    }
  };

  // Selección de quizzes para generación de preguntas
  const handleQuizSelect = (quizId) => {
    setSelectedQuizIds((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId]
    );
  };

  // Selección de dificultades
  const handleDifficultyToggle = (value) => {
    setSelectedDifficulties((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  };

  // Sliders independientes para rango de preguntas
  const MinMaxSlider = ({ min, max, value, onChange, label }) => (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-base-content">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range range-primary range-xs w-full"
      />
      <div className="flex justify-between text-xs text-base-content opacity-70 px-1 mt-1">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  // Maneja el check de preguntas seleccionadas
  const handlePreguntaCheck = (quizTitulo, idx) => {
    setSelectedPreguntas((prev) => {
      const prevSet = new Set(prev[quizTitulo] || []);
      if (prevSet.has(idx)) {
        prevSet.delete(idx);
      } else {
        prevSet.add(idx);
      }
      return { ...prev, [quizTitulo]: prevSet };
    });
  };

  // Subir preguntas seleccionadas a Firebase
  const handleUploadSelectedPreguntas = async () => {
    setUploading(true);
    try {
      if (!preguntasResponse || !Array.isArray(preguntasResponse.questions) || selectedQuizzesToUpload.length === 0) {
        alert("Selecciona al menos un quiz para subir.");
        setUploading(false);
        return;
      }

      // Agrupa preguntas por quizTitulo
      const quizzesMap = preguntasResponse.questions.reduce((acc, q) => {
        if (q.quizTitulo && selectedQuizzesToUpload.includes(q.quizTitulo)) {
          if (!acc[q.quizTitulo]) acc[q.quizTitulo] = [];
          acc[q.quizTitulo].push(q);
        }
        return acc;
      }, {});

      // Genera el JSON para cada quiz seleccionado
      const result = Object.entries(quizzesMap).map(([quizTitulo, preguntasArr]) => {
        const dificultadMap = { baja: 1, media: 2, alta: 3, "muy alta": 4 };
        const dificultadInvMap = { 1: "Baja", 2: "Media", 3: "Alta", 4: "Muy alta" };
        const sumDificultad = preguntasArr.reduce(
          (acc, q) => acc + (dificultadMap[q.data?.dificultad?.toLowerCase()] || 1),
          0
        );
        const avgDificultadNum = Math.round(sumDificultad / preguntasArr.length) || 1;
        const avgDificultad = dificultadInvMap[avgDificultadNum] || "Baja";

        const mainSubcatId = preguntasArr[0]?.data?.id_subcategoria || "";
        const mainSubcatNombre = preguntasArr[0]?.quizTitulo || "";

        const preguntasMap = {};
        preguntasArr.forEach((q, idx) => {
          preguntasMap[`pregunta_${idx + 1}`] = {
            enunciado: q.data?.enunciado,
            dificultad: q.data?.dificultad
              ? q.data.dificultad.charAt(0).toUpperCase() + q.data.dificultad.slice(1)
              : "",
            opciones: {
              a: q.data?.opciones?.a,
              b: q.data?.opciones?.b,
              c: q.data?.opciones?.c,
              d: q.data?.opciones?.d,
              correcta: q.data?.opciones?.correcta,
            },
            explicacion: q.data?.explicacion,
            id_subcategoria: q.data?.id_subcategoria,
          };
        });

        return {
          quiz: {
            nombre: quizTitulo,
            dificultad: avgDificultad,
            cantidad_preguntas: preguntasArr.length,
            tiempo_estimado: preguntasArr.length * 3,
            main_subcategory: {
              id: mainSubcatId,
              nombre: mainSubcatNombre,
            },
          },
          preguntas: preguntasMap,
        };
      });

      // Subir a Firebase usando el método uploadQuizzesAndQuestions
      await uploadQuizzesAndQuestions(result);

      setPreguntasResponse(null);
      setSelectedQuizzesToUpload([]);
      setPreguntasError("");
      setError("");
      alert("¡Quizzes y preguntas subidos exitosamente a Firebase!");
    } catch (err) {
      alert(
        err?.message ||
          "Ocurrió un error inesperado al subir los quizzes y preguntas a Firebase."
      );
    } finally {
      setUploading(false);
    }
  };

  // Selección de quizzes generados para subir
  const handleQuizGeneratedCheck = (quizTitulo) => {
    setSelectedQuizzesToUpload((prev) =>
      prev.includes(quizTitulo)
        ? prev.filter((t) => t !== quizTitulo)
        : [...prev, quizTitulo]
    );
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl bg-base-100 min-h-screen">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-base-content">Generador de Quizzes</h1>

      {/* Sección de generación de quizzes */}
      <div className="card bg-base-200 shadow-sm mb-6">
        <div className="card-body">
          <h2 className="card-title text-lg text-base-content">Generar nuevos quizzes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selector de subcategoría */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Subcategoría:</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                <option value="">-- Selecciona --</option>
                {subcategories.map((sub) => (
                  <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider para cantidad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Cantidad (1-10):</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="range range-primary range-sm w-full"
              />
              <div className="flex justify-between text-xs text-base-content opacity-70 px-1">
                <span>1</span>
                <span>{quizCount}</span>
                <span>10</span>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              onClick={handleGenerateQuizzes}
              disabled={loading || !selectedSubcategory}
              className="btn btn-primary"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              Generar Quizzes
            </button>
          </div>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mostrar quizzes generados recientemente */}
      {generatedQuizzes.length > 0 && (
        <div className="card bg-base-200 shadow-sm mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg text-base-content">
              Quizzes generados ({generatedQuizzes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {generatedQuizzes.map((quiz, idx) => {
                const quizId = quiz._localId || quiz.data?.nombre || quiz.data?.id || idx;
                return (
                  <div
                    key={quizId}
                    className="bg-base-100 rounded-box p-3 flex items-center gap-2 border border-base-300"
                  >
                    {quiz.status === "success" && quiz.data ? (
                      <>
                        <div className="font-bold text-sm truncate">{quiz.data.nombre}</div>
                      </>
                    ) : (
                      <div className="text-error text-xs">
                        Error al generar quiz: {quiz.reason || "Desconocido"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Panel de generación de preguntas */}
      {allQuizzes.length > 0 && (
        <div className="card bg-base-200 shadow-sm mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg text-base-content">Generar preguntas</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna 1: Opciones */}
              <div>
                <div className="mb-4">
                  <label className="block font-medium mb-2 text-base-content">
                    Dificultad de preguntas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`btn btn-sm ${
                          selectedDifficulties.includes(opt.value)
                            ? "btn-primary"
                            : "btn-ghost bg-base-100"
                        }`}
                        onClick={() => handleDifficultyToggle(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <MinMaxSlider
                  min={3}
                  max={8}
                  value={minQuestions}
                  onChange={setMinQuestions}
                  label="Cantidad mínima de preguntas"
                />
                <MinMaxSlider
                  min={8}
                  max={20}
                  value={maxQuestions}
                  onChange={setMaxQuestions}
                  label="Cantidad máxima de preguntas"
                />

                <button
                  className="btn btn-primary w-full mt-4"
                  disabled={
                    selectedQuizIds.length === 0 ||
                    selectedDifficulties.length === 0 ||
                    preguntasLoading
                  }
                  onClick={async () => {
                    setPreguntasResponse(null);
                    setPreguntasError("");
                    setPreguntasLoading(true);
                    try {
                      const selectedQuizzes = allQuizzes.filter(q => {
                        const quizId = q._localId || q.data?.nombre || q.data?.id;
                        return selectedQuizIds.includes(quizId);
                      });

                      const quizzesMap = {};
                      selectedQuizzes.forEach(q => {
                        quizzesMap[q.data?.nombre] = {
                          subcategoria: q.data?.subcategoria || q.data?.sub_categoria,
                          id_subcategoria: q.data?.id_subcategoria || q.data?.subcategoria_id || q.data?.id_subcategoria,
                        };
                      });

                      const payload = {
                        dificultades: selectedDifficulties,
                        cantidad_minima: minQuestions,
                        cantidad_maxima: maxQuestions,
                        quizzes: quizzesMap,
                      };

                      const resp = await generatePreguntas(payload);
                      setPreguntasResponse(resp);
                    } catch (err) {
                      setPreguntasError(
                        err?.message || "Ocurrió un error inesperado al generar preguntas."
                      );
                    } finally {
                      setPreguntasLoading(false);
                    }
                  }}
                >
                  {preguntasLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Generar y guardar preguntas
                </button>

                {preguntasError && (
                  <div className="alert alert-error mt-4">
                    <span>{preguntasError}</span>
                  </div>
                )}
              </div>

              {/* Columna 2: Quizzes almacenados */}
              <div>
                <label className="block font-medium mb-2 text-base-content">
                  Quizzes almacenados ({allQuizzes.length})
                </label>
                <div className="max-h-96 overflow-y-auto">
                  <ul className="space-y-2">
                    {allQuizzes.map((quiz, idx) => {
                      const quizId = quiz._localId || quiz.data?.nombre || quiz.data?.id || idx;
                      return (
                        <li
                          key={quizId}
                          className={`flex items-center gap-2 p-3 rounded-box ${
                            selectedQuizIds.includes(quizId)
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-base-100 border border-base-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuizIds.includes(quizId)}
                            onChange={() => handleQuizSelect(quizId)}
                            className="checkbox checkbox-sm checkbox-primary"
                          />
                          <span className="font-medium text-sm truncate flex-1">
                            {quiz.data?.nombre || "Quiz"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preguntas generadas */}
      {preguntasResponse && Array.isArray(preguntasResponse.questions) && preguntasResponse.questions.length > 0 && (
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg text-base-content">
              Preguntas generadas ({preguntasResponse.questions.length})
            </h2>
            <div className="space-y-4">
              {Object.entries(
                preguntasResponse.questions.reduce((acc, q, idx) => {
                  if (q.quizTitulo) {
                    if (!acc[q.quizTitulo]) acc[q.quizTitulo] = [];
                    acc[q.quizTitulo].push({ ...q, idx });
                  }
                  return acc;
                }, {})
              ).map(([quizTitulo, preguntas]) => (
                <div
                  key={quizTitulo}
                  className="bg-base-100 rounded-box border border-base-300 p-4"
                >
                  <div className="font-bold mb-2 text-base text-primary flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedQuizzesToUpload.includes(quizTitulo)}
                      onChange={() => handleQuizGeneratedCheck(quizTitulo)}
                      className="checkbox checkbox-xs checkbox-primary"
                      style={{ zIndex: 50 }}
                    />
                    {quizTitulo} ({preguntas.length} preguntas)
                  </div>
                  <ul className="space-y-3 mt-2">
                    {preguntas.map((q, i) => (
                      <li key={q.idx} className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{q.data?.enunciado}</p>
                          <p className="text-xs opacity-70 mt-1">
                            Dificultad: {q.data?.dificultad}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-primary"
                disabled={selectedQuizzesToUpload.length === 0 || uploading}
                onClick={handleUploadSelectedPreguntas}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Subir seleccionados a Firebase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;