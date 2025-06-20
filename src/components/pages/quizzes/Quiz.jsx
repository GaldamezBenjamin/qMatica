import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  getQuizByID,
  getQuizPreguntas,
  getUserQuizAttempts,
  getRangos,
  getDifEXP,
  createQuizAttempt,
  updateQuizAttempt,
  updateUserExperience,
} from "../../../helpers/apiHelpers";
import Alert from "../../shared/Alert";
import { ArrowBigUpDash } from "lucide-react";
import { useUser } from "../../../context/UserContext";

function Quiz({}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctas, setCorrectas] = useState([]);
  const [expPorDificultad, setExpPorDificultad] = useState({});
  const [rangos, setRangos] = useState([]);
  const [selecteds, setSelecteds] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const timerRef = React.useRef();
  const { userData, refreshUserData } = useUser();
  const [quizYaIntentado, setQuizYaIntentado] = useState(false); // Nuevo estado

  let allAnswered = false;

  useEffect(() => {
    let quizId = location.state?.quizId;
    // If not in state, try URL search params
    if (!quizId) {
      const params = new URLSearchParams(location.search);
      quizId = params.get('quizId');
    }

    if (!quizId || quizId.trim() === '') { // Ensure quizId is not null, undefined, or empty
      setAlert({ type: "error", message: "No se encontró el ID del quiz en la URL o estado." });
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Consultar intentos del usuario antes de cargar quiz
    const cargarDatos = async () => {
      try {
        // Obtener intentos del usuario para este quiz
        let yaIntentado = false;
        if (userData?.id) {
          const intentos = await getUserQuizAttempts(userData.id);
          if (Array.isArray(intentos)) {
            yaIntentado = intentos.some(
              (intento) => intento.id_quiz === quizId
            );
          }
        }

        setQuizYaIntentado(yaIntentado);

        // Cargar quiz, preguntas, exp y rangos
        const [quizInfo, preguntas, difExp, rangosApi] = await Promise.all([
          getQuizByID(quizId),
          getQuizPreguntas(quizId),
          getDifEXP(),
          getRangos(),
        ]);

        if (!quizInfo || !quizInfo.id_quiz) {
          console.log("Quiz info is invalid:", quizInfo);
          setAlert({ type: "error", message: "Datos del quiz incompletos o inválidos al cargar." });
          setLoading(false);
          return;
        }

        // Si ya intentó el quiz, poner EXP de todas las dificultades a 0
        let difExpFinal = { ...difExp };
        if (yaIntentado) {
          Object.keys(difExpFinal).forEach((k) => {
            difExpFinal[k] = 0;
          });
        }

        setQuiz({ ...quizInfo, preguntas });
        setExpPorDificultad(difExpFinal);
        setCorrectas(new Array(preguntas.length).fill(null));
        setSelecteds(new Array(preguntas.length).fill(null));
        const adaptados = (Array.isArray(rangosApi) ? rangosApi : []).map(
          (r) => ({
            ...r,
            exp: r.required_exp,
            nombre: r.name,
          })
        );
        setRangos(adaptados);
        setTiempo(0);
        setTimerStarted(false); // Reiniciar timerStarted al cargar quiz
        if (timerRef.current) clearTimeout(timerRef.current);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el quiz:", error);
        setAlert({ type: "error", message: `Error al cargar el quiz: ${error.message || 'Desconocido'}` });
        setLoading(false);
      }
    };

    cargarDatos();
  }, [location, userData?.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location]);

  useEffect(() => {
    if (timerStarted) {
      function tick() {
        setTiempo((t) => t + 1);
        timerRef.current = setTimeout(tick, 1000);
      }
      timerRef.current = setTimeout(tick, 1000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    }
  }, [timerStarted]);

  useEffect(() => {
    // Detener timer si todas respondidas
    if (
      quiz &&
      quiz.preguntas &&
      correctas &&
      correctas.length === quiz.preguntas.length &&
      correctas.every((v) => v !== null)
    ) {
      allAnswered = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [quiz, correctas]);

  let puntosActuales = 0;
  if (quiz && quiz.preguntas) {
    quiz.preguntas.forEach((preg, idx) => {
      if (correctas[idx]) {
        const dif = preg.dificultad;
        puntosActuales += expPorDificultad[dif] || 0;
      }
    });
  }

  if (
    quiz &&
    quiz.preguntas &&
    correctas &&
    correctas.length === quiz.preguntas.length
  ) {
    allAnswered = correctas.every((v) => v !== null);
  }

  const userExp = userData?.exp?.actual || 0;
  let rangoActual = rangos[0] || {
    nombre: "Sin rango",
    exp: 0,
    required_exp: 0,
  };
  let nextRango = null;
  for (let i = 1; i < rangos.length; i++) {
    if (userExp + puntosActuales >= rangos[i].required_exp) {
      rangoActual = rangos[i];
      nextRango = rangos[i + 1] || null;
    }
  }
  if (
    rangos.length > 0 &&
    userExp + puntosActuales >= rangos[rangos.length - 1].required_exp
  ) {
    rangoActual = rangos[rangos.length - 1];
    nextRango = null;
  }
  let expMin = rangoActual.required_exp;
  let expMax = nextRango ? nextRango.required_exp : rangoActual.required_exp;

  let percent = 0;
  let percentWithQuiz = 0;
  const requiredExpPlata =
    rangos.find((r) => (r.nombre || r.name) === "Plata")?.required_exp ?? 6000;
  const requiredExpOro =
    rangos.find((r) => (r.nombre || r.name) === "Oro")?.required_exp ?? 12000;

  if (!nextRango) {
    percent = 100;
    percentWithQuiz = 100;
    expMax = rangoActual.required_exp;
  } else if (
    (rangoActual.nombre === "Plata" || rangoActual.name === "Plata") &&
    nextRango &&
    requiredExpOro > requiredExpPlata
  ) {
    percent = Math.floor(
      ((userExp - requiredExpPlata) / (requiredExpOro - requiredExpPlata)) * 100
    );
    percentWithQuiz = Math.floor(
      ((userExp + puntosActuales - requiredExpPlata) /
        (requiredExpOro - requiredExpPlata)) *
        100
    );
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    if (percentWithQuiz > 100) percentWithQuiz = 100;
    if (percentWithQuiz < 0) percentWithQuiz = 0;
  } else {
    percent = Math.floor((userExp / expMax) * 100);
    percentWithQuiz = Math.floor(((userExp + puntosActuales) / expMax) * 100);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    if (percentWithQuiz > 100) percentWithQuiz = 100;
    if (percentWithQuiz < 0) percentWithQuiz = 0;
  }

  const totalCorrectas = correctas.filter((v) => v === true).length;
  const totalIncorrectas = correctas.filter((v) => v === false).length;

  const handleSelect = async (letra) => {
    setSelecteds((prev) => {
      const nuevo = [...prev];
      nuevo[currentIndex] = letra;
      return nuevo;
    });

    if (!timerStarted) {
      // Ensure quiz and its ID are available before making the API call
      if (!quiz || !quiz.id_quiz) {
        console.error("Error: Quiz data no está completamente cargada para iniciar el intento.");
        setAlert({ type: "error", message: "Error interno: Datos del quiz no cargados correctamente." });
        return; // Prevent API call
      }

      setTimerStarted(true);
      // Crear intento de quiz en la base de datos
      try {
        const res = await createQuizAttempt({ id_quiz: quiz.id_quiz }); // Use quiz.id directly
        // Si la respuesta tiene un id, guárdalo
        if (res && res.id_intento) setQuizAttemptId(res.id_intento);
      } catch (e) {
        // Manejo de error opcional
        console.error("Error al iniciar intento de quiz:", e);
        setAlert({ type: "error", message: e.message || "Error al iniciar intento de quiz." });
      }
    }
  };

  // Handler para terminar intento
  const handleTerminarIntento = async () => {
    if (!quizAttemptId || !quiz || !quiz.preguntas) return;

    // Construir respuestas_usuario
    const respuestas_usuario = quiz.preguntas.map((preg, idx) => ({
      id_pregunta: preg.id_pregunta,
      respuesta_usuario: selecteds[idx],
      es_correcta: correctas[idx],
    }));

    try {
      await updateQuizAttempt(quizAttemptId, { respuestas_usuario });

      // Actualizar experiencia del usuario
      const nuevaExp = (userData?.exp?.actual || 0) + puntosActuales;
      await updateUserExperience(userData?.id, {
        actual: nuevaExp,
        anterior: userData?.exp?.anterior,
      });

      // Refrescar datos de usuario pero NO recargar la página ni navegar aquí
      refreshUserData && (await refreshUserData());

      // Preparar summary
      const summary = {
        nombre: quiz.nombre,
        subcategoria: quiz.main_subcategory?.nombre || 'N/A',
        cantidadPreguntas: quiz.cantidad_preguntas,
        tiempoEstimado: quiz.tiempo_estimado,
        totalCorrectas: totalCorrectas,
        totalIncorrectas: totalIncorrectas,
        tiempoTotal: tiempo,
        dificultad: quiz.dificultad || 'N/A',
        puntosObtenidos: puntosActuales,
        rangoProgreso: rangoActual.nombre || 'N/A',
        expMin: expMin,
        expMax: expMax,
        expActual: userData?.exp?.actual || 0,
        porcentajeProgreso: percentWithQuiz,
      };

      // Redirigir a /quiz/results con el summary en el estado
      navigate('/quiz/results', { state: { summary } });
    } catch (e) {
      console.error("Error al terminar el intento de quiz:", e);
      setAlert({ type: "error", message: e.message || "Error al terminar el intento de quiz." });
    }
  };

  const handleVerificar = () => {
    const selected = selecteds[currentIndex];
    if (selected) {
      const pregunta = quiz.preguntas[currentIndex];
      const esCorrecta = pregunta.opciones.correcta === selected;
      setCorrectas((prev) => {
        const nuevo = [...prev];
        nuevo[currentIndex] = esCorrecta;
        return nuevo;
      });
    }
  };

  const handleAnterior = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const handleSiguiente = () =>
    setCurrentIndex((i) => Math.min(i + 1, quiz.preguntas.length - 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg font-semibold text-gray-700">
        Cargando Quiz...
      </div>
    );
  }

  if (alert) {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert type={alert.type} message={alert.message} />
      </div>
    );
  }

  if (!quiz || !quiz.preguntas || quiz.preguntas.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-lg font-semibold text-gray-700">
        Quiz no encontrado o sin preguntas.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-col h-full bg-gray-100">
        {/* Mobile Left Panel (top section) */}
        <div className="lg:hidden">
          <LeftPanelHorizontal
            quiz={quiz}
            totalCorrectas={totalCorrectas}
            totalIncorrectas={totalIncorrectas}
            allAnswered={allAnswered}
            tiempo={tiempo}
            onTerminarIntento={handleTerminarIntento}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 h-full min-h-0 overflow-hidden">
          {/* Original Left Panel (hidden on mobile) */}
          <div className="hidden lg:flex w-2/6 lg:w-2/7 2xl:w-1/5 h-full min-h-0 flex-col transition-all duration-300 ease-in-out">
            <LeftPanel
              quiz={quiz}
              totalCorrectas={totalCorrectas}
              totalIncorrectas={totalIncorrectas}
              allAnswered={allAnswered}
              tiempo={tiempo}
              onTerminarIntento={handleTerminarIntento}
            />
          </div>

          {/* Question Panel */}
          <div className="w-full lg:w-4/5 xl:w-3/5 h-full min-h-0 flex flex-col">
            <PreguntaPanel
              quiz={quiz} // Here quiz is passed
              currentIndex={currentIndex}
              selected={selecteds[currentIndex]}
              handleSelect={handleSelect}
              correctas={correctas}
              handleVerificar={handleVerificar}
              handleAnterior={handleAnterior}
              handleSiguiente={handleSiguiente}
              selecteds={selecteds}
            />
          </div>

          {/* Original Right Panel (hidden on mobile) */}
          <div className="hidden w-0 xl:flex xl:w-2/8 2xl:w-1/5 h-full min-h-0 flex-col transition-[width] duration-300 ease-in-out">
            <RightPanel
              quiz={quiz}
              puntosActuales={puntosActuales}
              percent={percent}
              percentWithQuiz={percentWithQuiz}
              expMin={expMin}
              expMax={expMax}
              currentIndex={currentIndex}
              selected={selecteds[currentIndex]}
              handleVerificar={handleVerificar}
              handleAnterior={handleAnterior}
              handleSiguiente={handleSiguiente}
              correctas={correctas}
              selecteds={selecteds}
            />
          </div>
        </div>

        {/* Mobile Right Panel (footer) */}
        <div className="lg:hidden">
          <RightPanelHorizontal
            quiz={quiz}
            puntosActuales={puntosActuales}
            percent={percent}
            percentWithQuiz={percentWithQuiz}
            expMin={expMin}
            expMax={expMax}
            currentIndex={currentIndex}
            selected={selecteds[currentIndex]}
            handleVerificar={handleVerificar}
            handleAnterior={handleAnterior}
            handleSiguiente={handleSiguiente}
            correctas={correctas}
          />
        </div>
      </div>
    </div>
  );
}

export default Quiz;

function LeftPanel({
  quiz,
  totalCorrectas,
  totalIncorrectas,
  allAnswered,
  tiempo,
  onTerminarIntento,
}) {
  if (!quiz) return null;

  const getDifficultyColor = useCallback(() => {
    switch (quiz.dificultad?.toLowerCase()) {
      case "baja":
        return "bg-lime-400";
      case "media":
        return "bg-yellow-300";
      case "alta":
        return "bg-orange-400";
      case "muy alta":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  }, [quiz.dificultad]);

  const difficultyColor = getDifficultyColor();

  // Formatea el tiempo en mm:ss
  const minutos = String(Math.floor(tiempo / 60)).padStart(2, "0");
  const segundos = String(tiempo % 60).padStart(2, "0");
  return (
    <div className="bg-white rounded-box m-4 p-4 h-full flex flex-col justify-between">
      {/* Quiz Info - Top */}
      <div>
        <div className={`rounded-lg h-4 my-3 flex-none ${difficultyColor}`} />
        <div>
          <p className="text-lg xl:text-xl font-semibold mb-1">{quiz.nombre}</p>
          <p className="text-xs xl:text-sm font-medium mb-8">
            {quiz.main_subcategory?.nombre}
          </p>
          <p className="text-xs xl:text-sm font-medium">
            {quiz.cantidad_preguntas} preguntas
          </p>
          <p className="text-xs xl:text-sm text-gray-400">
            Tiempo estimado: {quiz.tiempo_estimado} min
          </p>
        </div>
        <div className="divider divider-neutral my-5 w-full"></div>
      </div>
      {/* Quiz Stats - Center */}
      <div className="flex flex-col items-center text-center">
        <p className="text-md xl:text-lg font-semibold mb-2">Tiempo actual:</p>
        <div className="bg-gray-50 rounded-lg p-2 xl:p-3 flex items-center justify-center w-full mb-5 xl:mb-10">
          <span className="text-sm xl:text-base font-semibold">
            {minutos}:{segundos}
          </span>
        </div>
        <p className="text-md xl:text-lg font-semibold mb-2">
          Respuestas Correctas:
        </p>
        <div className="bg-gray-50 rounded-lg p-2 xl:p-3 flex items-center justify-center w-full mb-5 xl:mb-10">
          <span className="text-sm xl:text-base font-semibold text-success">
            {totalCorrectas}
          </span>
        </div>
        <p className="text-md xl:text-lg font-semibold mb-2">
          Respuestas Incorrectas:
        </p>
        <div className="bg-gray-50 rounded-lg p-2 xl:p-3 flex items-center justify-center w-full">
          <span className="text-sm xl:text-base font-semibold text-error">
            {totalIncorrectas}
          </span>
        </div>
      </div>
      {/* Finish Attempt - Bottom */}
      <div className="flex flex-col items-center text-center">
        <div className="divider divider-neutral my-5 w-full"></div>
        <p className="text-xs xl:text-sm font-semibold text-gray-400">
          Aún tienes preguntas sin responder
        </p>
        <button
          className="btn btn-primary w-full mt-4 mb-3 text-sm xl:text-base"
          disabled={!allAnswered}
          onClick={onTerminarIntento}
        >
          Terminar intento
        </button>
      </div>
    </div>
  );
}

function PreguntaPanel({
  quiz,
  currentIndex,
  selected,
  handleSelect,
  correctas,
  handleVerificar,
  handleAnterior,
  handleSiguiente,
  selecteds,
}) {
  if (!quiz || !quiz.preguntas) return null;
  const pregunta = quiz.preguntas?.[currentIndex];
  if (!pregunta) return <div>No hay preguntas.</div>;
  const letras = ["a", "b", "c", "d"];

  let explicacionColor,
    borderColor,
    bgColor = "";
  if (correctas[currentIndex] === true) {
    explicacionColor = "text-green-600";
    borderColor = "border-green-600";
    bgColor = "bg-green-600/8";
  }
  if (correctas[currentIndex] === false) {
    explicacionColor = "text-red-600";
    borderColor = "border-red-600";
    bgColor = "bg-red-600/8";
  }

  const allowSelect = correctas[currentIndex] === null;
  const puedeVerificar = ["a", "b", "c", "d"].includes(selected) && allowSelect;

  return (
    <div className="rounded-box m-4 p-6 h-full flex flex-col">
      <div className="mb-3 xl:mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <p className="text-3xl font-bold">
              Pregunta {currentIndex + 1} de {quiz.cantidad_preguntas}
            </p>
          </div>
          <span className="text-base font-medium text-gray-500 text-left">
            Dificultad: {pregunta.dificultad || "N/A"}
          </span>
        </div>
        {/* Barra de progreso con transición */}
        <div className="relative w-full h-3 rounded-xl mt-2 bg-gray-200 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / quiz.cantidad_preguntas) * 100}%`,
            }}
          />
        </div>
      </div>
      {/* Enunciado y Opciones */}
      <div className="flex flex-col items-center w-full mb-6">
        <div className="w-full">
          <p className="text-base xl:text-xl font-semibold mb-4">
            {pregunta.enunciado}
          </p>
          <div className="flex flex-col space-y-2 xl:space-y-3">
            {letras.map((letra, idx) => (
              <div
                key={letra}
                className={`p-2 xl:p-4 border rounded-lg cursor-pointer text-sm xl:text-lg transition ${
                  selected === letra
                    ? "bg-qmat1 text-white border-qmat1"
                    : "hover:bg-gray-100"
                } ${!allowSelect ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => allowSelect && handleSelect(letra)}
              >
                <span className="font-semibold">
                  {String.fromCharCode(65 + idx)}) {pregunta.opciones?.[letra]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Retroalimentación */}
      <div className="flex-1 flex items-start justify-start w-full">
        {correctas[currentIndex] !== null && (
          <div
            className={`border-1 rounded-lg px-4 py-2 w-full mt-2 ${bgColor} ${borderColor}`}
          >
            <span
              className={`text-xs xl:text-sm font-medium ${explicacionColor} text-left block`}
            >
              {pregunta.explicacion}
            </span>
          </div>
        )}
      </div>
      <div className="mb-4 xl:hidden">
        <div className="flex justify-between gap-2 mb-4">
          <button
            className="btn flex-1"
            onClick={handleAnterior}
            disabled={currentIndex === 0}
          >
            Anterior
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleVerificar}
            disabled={!puedeVerificar}
          >
            Verificar
          </button>
          <button
            className="btn flex-1"
            onClick={handleSiguiente}
            disabled={currentIndex === quiz.preguntas.length - 1}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

function RightPanel({
  quiz,
  puntosActuales,
  percent,
  percentWithQuiz,
  expMin,
  expMax,
  currentIndex,
  selected,
  handleVerificar,
  handleAnterior,
  handleSiguiente,
  correctas,
}) {
  if (!quiz || !quiz.preguntas) return null;
  const { userData } = useUser();
  const userExp = userData?.exp?.actual || 0;

  // Determinar icono y colores según rango
  let rangoIcono = "I";
  let gradFrom = "#de9c5f";
  let gradTo = "#b87333";
  let letraColor = "#744920";
  let rangoNombre = "Bronce";
  if (expMin === 0 || expMin < 6000) rangoNombre = "Bronce";
  if (expMin >= 6000) rangoNombre = "Plata";
  if (expMin >= 12000) rangoNombre = "Oro";

  if (quiz && quiz.rangos && quiz.rangos.length) {
    const actual = quiz.rangos.find((r) => r.required_exp === expMin);
    if (actual) rangoNombre = actual.nombre || actual.name;
  }

  if (rangoNombre === "Bronce") {
    rangoIcono = "I";
    gradFrom = "#de9c5f";
    gradTo = "#b87333";
    letraColor = "#744920";
  } else if (rangoNombre === "Plata") {
    rangoIcono = "II";
    gradFrom = "#e6e6e6";
    gradTo = "#c0c0c0";
    letraColor = "#7b7b7b";
  } else if (rangoNombre === "Oro") {
    rangoIcono = "III";
    gradFrom = "#fad766";
    gradTo = "#d4af37";
    letraColor = "#9b7f29";
  }

  // El botón de verificar debe estar habilitado si selected es una string válida (a, b, c, d) y la pregunta no ha sido verificada
  const puedeVerificar =
    ["a", "b", "c", "d"].includes(selected) && correctas[currentIndex] === null;

  return (
    <div className="bg-white rounded-box m-4 p-4 h-full flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center h-[60%]">
        <p className="text-lg font-semibold text-center mt-2 mb-1">
          Progreso EXP
        </p>
        <p
          className="text-2xl font-bold text-center mb-2"
          style={{ color: letraColor }}
        >
          {rangoNombre}
        </p>
        <div className="flex items-center justify-center mb-4">
          <div
            className="w-[70px] h-[84px] flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${gradFrom}, ${gradTo})`,
              clipPath: "polygon(100% 0, 100% 85.9%, 48% 100%, 0 85.9%, 0 0)",
            }}
          >
            <span
              className="text-5xl font-extrabold pb-1"
              style={{ color: letraColor }}
            >
              {rangoIcono}
            </span>
          </div>
        </div>
        <div className="relative w-full mb-2 mt-5">
          <div
            className="flex justify-between absolute w-full px-1 z-20"
            style={{ top: "-1.5rem" }}
          >
            <span className="text-black font-bold text-sm">{expMin}</span>
            <span className="text-black font-bold text-sm">{expMax}</span>
          </div>
          <div className="relative w-full h-5 rounded-xl overflow-hidden">
            {/* Barra de fondo (gris, porcentaje dinámico) */}
            <div className="absolute left-0 top-0 h-full w-full bg-gray-100 z-0" />
            {/* Barra superior (degradado, progreso actual) */}
            <div
              className="absolute left-0 top-0 h-full rounded-2xl z-20"
              style={{
                width: `${percentWithQuiz}%`,
                background: `linear-gradient(to bottom right, ${gradFrom}, ${gradTo})`,
                opacity: 1,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
        </div>
        <span className="font-semibold text-2xl mt-2">{percentWithQuiz}%</span>
        <p className="text-xs font-medium text-gray-400 mt-3">
          Termina el quiz para reclamar la EXP
        </p>
        <div className="my-6" />
        <p className="text-lg font-semibold mb-2">Puntos actuales:</p>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center w-full mb-10">
          <span className="font-semibold">{puntosActuales} EXP</span>
        </div>
      </div>
      {/* Bottom: Botones */}
      <div className="flex flex-col justify-between h-[40%]">
        <div className="divider divider-neutral my-5 w-full"></div>
        <p className="text-center font-semibold mb-1">Verificar respuesta</p>
        <button
          className="btn btn-primary w-20 h-20 mb-3 text-base font-bold rounded-xl mx-auto flex items-center justify-center"
          style={{ minWidth: 80, minHeight: 80 }}
          onClick={puedeVerificar ? handleVerificar : undefined}
          disabled={!puedeVerificar}
        >
          <ArrowBigUpDash size={48} />
        </button>
        <div className="flex flex-row gap-2 w-full mb-3 items-center">
          <button
            className="btn flex-1"
            onClick={handleAnterior}
            disabled={currentIndex === 0}
          >
            <p>Anterior</p>
          </button>
          <button
            className="btn flex-1"
            onClick={handleSiguiente}
            disabled={currentIndex === quiz.preguntas.length - 1}
          >
            <p>Siguiente</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Horizontal Left Panel (for mobile)
function LeftPanelHorizontal({
  quiz,
  totalCorrectas,
  totalIncorrectas,
  allAnswered,
  tiempo,
  onTerminarIntento,
}) {
  if (!quiz) return null;

  const getDifficultyColor = useCallback(() => {
    switch (quiz.dificultad?.toLowerCase()) {
      case "baja":
        return "bg-lime-400";
      case "media":
        return "bg-yellow-300";
      case "alta":
        return "bg-orange-400";
      case "muy alta":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  }, [quiz.dificultad]);

  const difficultyColor = getDifficultyColor();
  const minutos = String(Math.floor(tiempo / 60)).padStart(2, "0");
  const segundos = String(tiempo % 60).padStart(2, "0");

  return (
    <div className="bg-white p-3">
      <div className="flex">
        {/* Difficulty color bar (vertical) */}
        <div className={`w-2 mr-3 rounded-full ${difficultyColor}`}></div>

        {/* Quiz info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-md font-semibold">{quiz.nombre}</p>
              <p className="text-xs font-medium text-gray-500">
                {quiz.main_subcategory?.nombre}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold">
                {quiz.cantidad_preguntas} preguntas
              </p>
              <p className="text-xs font-medium text-gray-500">
                {quiz.tiempo_estimado} min
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex justify-around mt-3 text-center">
            <div>
              <p className="text-xs font-semibold">Tiempo</p>
              <div className="bg-gray-50 rounded p-1">
                <span className="text-xs font-semibold">
                  {minutos}:{segundos}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold">Correctas</p>
              <div className="bg-gray-50 rounded p-1">
                <span className="text-xs font-semibold text-success">
                  {totalCorrectas}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold">Incorrectas</p>
              <div className="bg-gray-50 rounded p-1">
                <span className="text-xs font-semibold text-error">
                  {totalIncorrectas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finish button */}
      <button
        className="btn btn-primary btn-sm w-full mt-3"
        disabled={!allAnswered}
        onClick={onTerminarIntento}
      >
        Terminar intento
      </button>
    </div>
  );
}

// Horizontal Right Panel (footer for mobile)
function RightPanelHorizontal({
  quiz,
  puntosActuales,
  percent,
  percentWithQuiz,
  expMin,
  expMax,
}) {
  if (!quiz) return null;
  const { userData } = useUser();
  const userExp = userData?.exp?.actual || 0;

  let rangoIcono = "I";
  let gradFrom = "#de9c5f";
  let gradTo = "#b87333";
  let letraColor = "#744920";
  let rangoNombre = "Bronce";
  if (expMin === 0 || expMin < 6000) rangoNombre = "Bronce";
  if (expMin >= 6000) rangoNombre = "Plata";
  if (expMin >= 12000) rangoNombre = "Oro";

  if (quiz && quiz.rangos && quiz.rangos.length) {
    const actual = quiz.rangos.find((r) => r.required_exp === expMin);
    if (actual) rangoNombre = actual.nombre || actual.name;
  }

  if (rangoNombre === "Bronce") {
    rangoIcono = "I";
    gradFrom = "#de9c5f";
    gradTo = "#b87333";
    letraColor = "#744920";
  } else if (rangoNombre === "Plata") {
    rangoIcono = "II";
    gradFrom = "#e6e6e6";
    gradTo = "#c0c0c0";
    letraColor = "#7b7b7b";
  } else if (rangoNombre === "Oro") {
    rangoIcono = "III";
    gradFrom = "#fad766";
    gradTo = "#d4af37";
    letraColor = "#9b7f29";
  }

  return (
    <div className="bg-white p-3">
      <div className="flex items-center justify-between w-full">
        {/* First Column - Rank Icon and Name */}
        <div className="flex items-start w-1/5 min-w-[100px]">
          <div className="mr-2">
            <div
              className="w-[40px] h-[48px] flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom right, ${gradFrom}, ${gradTo})`,
                clipPath: "polygon(100% 0, 100% 85.9%, 48% 100%, 0 85.9%, 0 0)",
              }}
            >
              <span
                className="text-2xl font-extrabold pb-1"
                style={{ color: letraColor }}
              >
                {rangoIcono}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rango:</p>
            <p className="text-sm font-semibold" style={{ color: letraColor }}>
              {rangoNombre}
            </p>
          </div>
        </div>

        {/* Second Column - Progress Bar (centered and wider) */}
        <div className="flex-1 mx-4 w-3/5">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>{expMin}</span>
            <span>{expMax}</span>
          </div>
          <div className="relative w-full h-3 rounded-xl overflow-hidden bg-gray-100">
            <div
              className="absolute left-0 top-0 h-full rounded-xl"
              style={{
                width: `${percentWithQuiz}%`,
                background: `linear-gradient(to right, ${gradFrom}, ${gradTo})`,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
          <p className="text-center text-sm font-semibold mt-1">
            {percentWithQuiz}%
          </p>
        </div>

        {/* Third Column - Points (right-aligned) */}
        <div className="flex flex-col items-end w-1/5 min-w-[80px]">
          <p className="text-xs text-gray-500">Puntos actuales:</p>
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-sm font-semibold">{puntosActuales} EXP</span>
          </div>
        </div>
      </div>
    </div>
  );
}