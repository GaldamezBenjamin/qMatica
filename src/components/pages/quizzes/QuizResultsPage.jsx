import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Layers,
  Award,
} from "lucide-react";

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary;

  if (!summary) {
    navigate("/quizzes", { replace: true });
    return null;
  }

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  let rangoIcono = "I";
  let gradFrom = "#de9c5f";
  let gradTo = "#b87333";
  let letraColor = "#744920";
  let rangoNombre = summary.rangoProgreso;
  if (summary.expMin === 0 || summary.expMin < 6000) rangoNombre = "Bronce";
  if (summary.expMin >= 6000) rangoNombre = "Plata";
  if (summary.expMin >= 12000) rangoNombre = "Oro";

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

  // Calculate accuracy percentage
  const accuracy = Math.round(
    (summary.totalCorrectas / summary.cantidadPreguntas) * 100
  );

  return (
    <div className="md:h-[calc(100vh-64px)] md:max-h-[calc(100vh-64px)] overflow-hidden bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Results Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Quiz Info Section */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
              <BookOpen className="mr-3" size={20} />
              {summary.nombre}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center text-neutral-500">
                <Layers className="mr-2" size={18} />
                <span className="font-medium">Subcategoría: &nbsp;</span>
                {summary.subcategoria}
              </div>
              <div className="flex items-center text-neutral-500">
                <Clock className="mr-2" size={18} />
                <span className="font-medium">
                  Tiempo estimado: &nbsp;
                </span>{" "}
                {summary.tiempoEstimado} min
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Accuracy Card */}
              <div className="bg-qmat1/10 rounded-lg p-4 text-center">
                <div className="text-qmat1 font-bold text-4xl mb-2">
                  {accuracy}%
                </div>
                <div className="text-qmat1 font-medium">Precisión</div>
              </div>

              {/* Correct Answers Card */}
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center text-green-600 mb-2">
                  <CheckCircle size={24} className="mr-2" />
                  <span className="font-bold text-4xl">
                    {summary.totalCorrectas}
                  </span>
                </div>
                <div className="text-green-800 font-medium">Correctas</div>
              </div>

              {/* Incorrect Answers Card */}
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center text-red-600 mb-2">
                  <XCircle size={24} className="mr-2" />
                  <span className="font-bold text-4xl">
                    {summary.totalIncorrectas}
                  </span>
                </div>
                <div className="text-red-800 font-medium">Incorrectas</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium">Total preguntas:</span>
                <span className="font-semibold">
                  {summary.cantidadPreguntas}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium">Tiempo utilizado:</span>
                <span className="font-semibold">
                  {formatTime(summary.tiempoTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium">Dificultad:</span>
                <span className="font-semibold capitalize">
                  {summary.dificultad?.toLowerCase() || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium">Puntos obtenidos:</span>
                <span className="font-semibold">
                  {summary.puntosObtenidos || 0} EXP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {summary.rangoProgreso && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
            <div className="text-center mb-2">
              <p className="text-sm font-medium text-black">Rango</p>
              <p
                className="text-xl font-semibold"
                style={{ color: letraColor }}
              >
                {rangoNombre}
              </p>
            </div>
            <div className="flex justify-center">
              <div
                className="w-[40px] h-[48px] flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${gradFrom}, ${gradTo})`,
                  clipPath:
                    "polygon(100% 0, 100% 85.9%, 48% 100%, 0 85.9%, 0 0)",
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

            {/* Second Column - Progress Bar (centered and wider) */}
            <div className="w-full">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{summary.expMin}</span>
                <span>{summary.expMax}</span>
              </div>
              <div className="relative w-full h-3 rounded-xl overflow-hidden bg-gray-100">
                <div
                  className="absolute left-0 top-0 h-full rounded-xl"
                  style={{
                    width: `${summary.porcentajeProgreso}%`,
                    background: `linear-gradient(to right, ${gradFrom}, ${gradTo})`,
                    transition: "width 1s ease-in-out",
                  }}
                />
              </div>
              <p className="text-center text-sm font-semibold mt-1">
                {summary.porcentajeProgreso}%
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/quizzes")}
            className="btn btn-primary px-8 py-3 text-lg font-medium"
          >
            Volver a Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
