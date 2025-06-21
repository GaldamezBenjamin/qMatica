import React, { useState, useEffect, useCallback, useMemo } from "react";
import mainPhoto4 from "../../../assets/images/main4.png";
import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../context/UserContext";
import {
  getCategorias,
  getSubCategorias,
  getRangos,
} from "../../../helpers/apiHelpers";
import { ChevronRight, Settings, Filter, Check, X } from "lucide-react";
import CatMenuItemCreator from "./CatMenuItemCreator";
import Footer from "../../shared/Footer";

// Panel superior con imagen y título mejorado
const PanelSec = () => (
  <div
    className="relative h-64 md:h-80 w-full bg-cover bg-center flex items-center justify-center"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mainPhoto4})`,
    }}
  >
    <div className="text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
        Creador de Quizzes
      </h1>
      <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto">
        Personaliza tu experiencia de aprendizaje seleccionando categorías y
        dificultad
      </p>
    </div>
  </div>
);

// Menú de categorías con estilos iguales a QuizzesMenu
const CategoriesSelector = ({ selected, setSelected, maxCategories }) => {
  const [loading, setLoading] = useState(true);
  const [temarioM1, setTemarioM1] = useState([]);
  const [temarioM2, setTemarioM2] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [subCats, cats] = await Promise.all([
          getSubCategorias(),
          getCategorias(),
        ]);
        const subMap = subCats.reduce((acc, sub) => {
          if (!acc[sub.id_categoria]) acc[sub.id_categoria] = [];
          acc[sub.id_categoria].push(sub);
          return acc;
        }, {});
        const m1 = [],
          m2 = [];
        cats.forEach((cat) => {
          const c = { ...cat, subcategories: subMap[cat.id_categoria] || [] };
          if (cat.paes === "M1") m1.push(c);
          else if (cat.paes === "M2") m2.push(c);
        });
        m1.sort((a, b) => a.nombre.localeCompare(b.nombre));
        m2.sort((a, b) => a.nombre.localeCompare(b.nombre));
        if (mounted) {
          setTemarioM1(m1);
          setTemarioM2(m2);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedSet = useMemo(
    () => new Set(selected.map((s) => s.id_subcategoria)),
    [selected]
  );

  const canSelectMore = selected.length < maxCategories;

  const handleCheckboxChange = (id_subcategoria, isChecked) => {
    setSelected((prev) => {
      const prevSet = new Set(prev.map((s) => s.id_subcategoria));
      if (isChecked) {
        if (!prevSet.has(id_subcategoria) && prev.length < maxCategories) {
          const allSubs = [...temarioM1, ...temarioM2].flatMap(
            (cat) => cat.subcategories
          );
          const sub = allSubs.find(
            (s) => s.id_subcategoria === id_subcategoria
          );
          if (sub) return [...prev, { id_subcategoria, nombre: sub.nombre }];
        }
        return prev;
      } else {
        return prev.filter((s) => s.id_subcategoria !== id_subcategoria);
      }
    });
  };

  if (loading) {
    return (
      <ul className="menu menu-sm bg-white rounded-box w-75 h-500 p-4">
        <div className="w-50 h-8 bg-gray-200 animate-pulse rounded my-1"></div>
        <div className="w-40 h-5 bg-gray-200 animate-pulse rounded my-2"></div>
        <div className="w-65 h-300 bg-gray-200 animate-pulse rounded my-1"></div>
      </ul>
    );
  }

  return (
    <ul className="menu menu-sm bg-white rounded-box w-75 p-4">
      <li className="menu-title text-gray-800 text-lg font-bold">Categorías</li>
      <li className="menu-title text-gray-800 text-md font-bold mt-2">
        Temario M1
      </li>
      {temarioM1.length > 0 ? (
        temarioM1.map((cat) => (
          <CatMenuItemCreator
            key={cat.id_categoria}
            category={cat}
            currentSelectedSubcategories={selectedSet}
            onCheckboxChange={handleCheckboxChange}
            disableCheckboxes={!canSelectMore}
            selectedCount={selected.length}
            maxCategories={maxCategories}
          />
        ))
      ) : (
        <li>
          <span className="text-gray-500">No hay categorías para M1.</span>
        </li>
      )}
      <li className="menu-title text-gray-800 text-md font-bold mt-4">
        Temario M2
      </li>
      {temarioM2.length > 0 ? (
        temarioM2.map((cat) => (
          <CatMenuItemCreator
            key={cat.id_categoria}
            category={cat}
            currentSelectedSubcategories={selectedSet}
            onCheckboxChange={handleCheckboxChange}
            disableCheckboxes={!canSelectMore}
            selectedCount={selected.length}
            maxCategories={maxCategories}
          />
        ))
      ) : (
        <li>
          <span className="text-gray-500">No hay categorías para M2.</span>
        </li>
      )}
    </ul>
  );
};

// QuizCard con botón dinámico y console.log al presionar
const CustomQuizCard = ({
  username,
  rangoColor,
  cantidadPreguntas,
  dificultad,
  selectedCategories
}) => {
  const { currentUser } = useAuth();
  // Colores de dificultad como en QuizzesMenu
  const getDifficultyColor = () => {
    switch (dificultad?.toLowerCase()) {
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
  };
  const difficultyColor = getDifficultyColor();

  const handleCreate = () => {
    const quizData = {
      nombre: `${username}'s Custom Quiz`,
      dificultad,
      cantidad_preguntas: cantidadPreguntas,
      tiempo_estimado: -1,
      sub_categorias: selectedCategories.map(cat => cat.id_subcategoria)
    };
    console.log(JSON.stringify(quizData, null, 2));
  };

  return (
    <div className="bg-white rounded-lg p-4 flex flex-row items-stretch h-48 relative shadow">
      <div className={`rounded-lg w-3 mr-4 flex-none ${difficultyColor}`}></div>
      <div className="flex flex-col grow justify-between">
        <div>
          <div className="text-xl font-semibold">
            {username}'s Custom Quiz
          </div>
          <p className="text-md font-medium">Múltiples categorías</p>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-md font-medium">{cantidadPreguntas} preguntas</p>
          <p className="text-gray-400">Tiempo estimado: ???</p>
        </div>
      </div>
      <div className="flex items-center justify-center ml-4">
        <button
          className={`btn rounded-xl h-20 w-20 flex items-center justify-center p-0 min-h-0 ${difficultyColor}`}
          onClick={handleCreate}
          disabled={selectedCategories.length === 0}
        >
          <ChevronRight color="white" size={70} />
        </button>
      </div>
    </div>
  );
};

// Selector de dificultad mejorado
const dificultadOptions = [
  {
    label: "Baja",
    value: "baja",
    color: "bg-lime-400",
    text: "text-green-800",
  },
  {
    label: "Media",
    value: "media",
    color: "bg-yellow-400",
    text: "text-yellow-800",
  },
  {
    label: "Alta",
    value: "alta",
    color: "bg-orange-400",
    text: "text-orange-800",
  },
  {
    label: "Muy Alta",
    value: "muy alta",
    color: "bg-red-400",
    text: "text-red-800",
  },
];

const DificultadSelector = ({ value, setValue }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
    {dificultadOptions.map((opt) => (
      <button
        key={opt.value}
        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
          value === opt.value
            ? `${opt.color} text-white border-transparent shadow-md`
            : `bg-white border-gray-200 hover:border-gray-300 ${opt.text}`
        }`}
        onClick={() => setValue(opt.value)}
        type="button"
      >
        <div
          className={`w-4 h-4 rounded-full mb-2
        ${value === opt.value ? `bg-white` : `${opt.color}`}
        `}
        ></div>
        <span className="font-medium">{opt.label}</span>
      </button>
    ))}
  </div>
);

// Configuración de preguntas mejorada
const QuestionConfig = ({ cantidadPreguntas, setCantidadPreguntas }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="font-medium text-gray-700">Número de preguntas</label>
      <span className="font-bold text-primary">{cantidadPreguntas}</span>
    </div>
    <input
      type="range"
      min={5}
      max={30}
      value={cantidadPreguntas}
      onChange={(e) => setCantidadPreguntas(Number(e.target.value))}
      className="range range-primary range-sm w-full"
    />
    <div className="flex justify-between text-xs text-gray-500 px-1">
      <span>5</span>
      <span>30</span>
    </div>
  </div>
);

// MainSection con layout mejorado
const MainSection = () => {
  const { currentUser } = useAuth();
  const { userData } = useUser();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cantidadPreguntas, setCantidadPreguntas] = useState(10);
  const [dificultad, setDificultad] = useState("baja");
  const [rangoColor, setRangoColor] = useState("bg-primary");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const getColor = async () => {
      if (!userData?.rango) return setRangoColor("bg-primary");
      const rangos = await getRangos();
      const rango = rangos.find((r) => r.name === userData.rango);
      if (mounted)
        setRangoColor(
          rango?.color
            ? rango.color
            : userData.rango === "Oro"
            ? "bg-yellow-500"
            : userData.rango === "Plata"
            ? "bg-gray-400"
            : userData.rango === "Bronce"
            ? "bg-orange-400"
            : "bg-primary"
        );
    };
    getColor();
    return () => {
      mounted = false;
    };
  }, [userData]);

  // Limita el número de categorías seleccionadas a 10 o la cantidad de preguntas, lo que sea menor
  const maxCategories = Math.min(10, cantidadPreguntas);

  // Si el usuario reduce la cantidad de preguntas por debajo de las categorías seleccionadas, recorta la selección
  useEffect(() => {
    if (selectedCategories.length > maxCategories) {
      setSelectedCategories((prev) => prev.slice(0, maxCategories));
    }
  }, [cantidadPreguntas]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <PanelSec />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Botón para abrir drawer en mobile */}
        <div className="block lg:hidden mb-4">
          <button
            className="btn btn-outline w-full"
            onClick={() => setDrawerOpen(true)}
          >
            Seleccionar categorías
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Selector de categorías solo en lg+ */}
          <div className="hidden lg:block lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
              <CategoriesSelector
                selected={selectedCategories}
                setSelected={setSelectedCategories}
                maxCategories={maxCategories}
              />
            </div>
          </div>
          {/* Contenido principal */}
          <div className="lg:w-2/3 xl:w-3/4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Configura tu Quiz
              </h2>
              <p className="text-gray-600 mb-6">
                Selecciona las opciones para personalizar tu experiencia de
                aprendizaje
              </p>
              <div className="space-y-6">
                <QuestionConfig
                  cantidadPreguntas={cantidadPreguntas}
                  setCantidadPreguntas={setCantidadPreguntas}
                />
                <div>
                  <label className="font-medium text-gray-700 block mb-2">
                    Nivel de dificultad
                  </label>
                  <DificultadSelector
                    value={dificultad}
                    setValue={setDificultad}
                  />
                </div>
              </div>
            </div>
            <CustomQuizCard
              username={currentUser?.username || "Usuario"}
              rangoColor={rangoColor}
              cantidadPreguntas={cantidadPreguntas}
              dificultad={dificultad}
              selectedCategories={selectedCategories}
            />
            {/* Sección de categorías seleccionadas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-30 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>
                  Categorías seleccionadas ({selectedCategories.length}/{cantidadPreguntas > 10 ? 10 : cantidadPreguntas})
                </span>
              </h3>
              {selectedCategories.length === 0 ? (
                <div className="text-center py-8">
                  <X className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-500">
                    No has seleccionado ninguna categoría
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Selecciona al menos una categoría para crear tu quiz
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat.id_subcategoria}
                      className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                    >
                      {cat.nombre}
                      <button
                        onClick={() =>
                          setSelectedCategories((prev) =>
                            prev.filter(
                              (s) => s.id_subcategoria !== cat.id_subcategoria
                            )
                          )
                        }
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Drawer para mobile */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            ></div>
            <div className="relative bg-white w-80 max-w-full h-full shadow-xl z-50 mr-auto flex flex-col">
              {/* Cambiado ml-auto por mr-auto para drawer a la izquierda */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg">Menú</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <CategoriesSelector
                  selected={selectedCategories}
                  setSelected={setSelectedCategories}
                  maxCategories={maxCategories}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CreadorQuizzes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainSection />
      <Footer />
    </div>
  );
};
export default CreadorQuizzes;
