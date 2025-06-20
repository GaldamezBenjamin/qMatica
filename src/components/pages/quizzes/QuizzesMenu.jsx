import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import Footer from "../../shared/Footer";
import mainPhoto4 from "../../../assets/images/main4.png";
import CategoryMenuItem from "./CategoryMenuItem";
import Alert from "../../shared/Alert";
import {
  getSubCategorias,
  getCategorias,
  getQuizzes,
  getUserByID,
  getEXP,
  getRangos,
  getDifEXP
} from "../../../helpers/apiHelpers";
import { Menu, Search, ChevronRight, Crown, X } from "lucide-react";
import { useUser } from "../../../context/UserContext";

const areSetsEqual = (set1, set2) => {
  if (set1.size !== set2.size) return false;
  for (let item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
};

const PanelSec = React.memo(() => (
  <div
    className="hero h-[300px]"
    style={{
      backgroundImage: `url(${mainPhoto4})`,
    }}
  >
    <div className="hero-overlay bg-transparent"></div>
    <div className="hero-content text-center text-white">
      <h1 className="text-6xl font-bold">Quizzes</h1>
    </div>
  </div>
));

const QuizOverlay = React.memo(({ reason }) => (
  <div className="absolute inset-0 bg-black/75 rounded-lg flex flex-col items-center justify-center p-4 z-10">
    <div className="text-center text-white">
      <p className="font-bold text-2xl mb-1">{reason}</p>
      <div className="divider divider-neutral my-1"></div>
      <div className="flex flex-col items-center">
        <Crown size={24} className="mb-1" />
        <p className="text-xs">
          Alternativamente, puedes{" "}
          <a href="/subscripcion" className="underline font-medium">
            suscribirte
          </a>{" "}
          para desbloquear todos los quizzes inmediatamente.
        </p>
      </div>
    </div>
  </div>
));

const QuizCard = React.memo(({ quiz }) => {
  const { currentUser, isSubscribed } = useAuth();
  const { userData } = useUser();
  const [locked, setLocked] = useState(true);
  const [lockReason, setLockReason] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!currentUser) {
      setLocked(true);
      setLockReason("");
      return;
    }

    const userExp = userData?.exp.actual || 0;
    const difficulty = quiz.dificultad?.toLowerCase();

    if (difficulty === "baja" || difficulty === "media") {
      setLocked(false);
      setLockReason("");
      return;
    }

    if (difficulty === "muy alta") {
      getRangos().then((rangos) => {
      const oro = rangos.find((r) => r.name.toLowerCase() === "oro");
      const requiredExp = oro ? oro.required_exp : 12000;
      const hasRequiredExp = userExp >= requiredExp;
      if (!isSubscribed && !hasRequiredExp) {
        setLocked(true);
        setLockReason(`Debes ser rango Oro para hacer este quiz.`);
      } else {
        setLocked(false);
        setLockReason("");
      }
      });
      return;
    }

    setLocked(false);
    setLockReason("");
  }, [currentUser, isSubscribed, quiz.dificultad, userData]);

  const difficultyColor = getDifficultyColor();

  const handleStartQuiz = useCallback(() => {
    if (!locked) {
      navigate("/quiz", { state: { quizId: quiz.id_quiz } });
    }
  }, [locked, navigate, quiz.id_quiz]);

  return (
    <div className="bg-white rounded-lg p-4 flex flex-row items-stretch h-48 relative">
      {locked && <QuizOverlay reason={lockReason} />}
      <div className={`rounded-lg w-3 mr-4 flex-none ${difficultyColor}`}></div>
      <div className="flex flex-col grow justify-between">
        <div>
          <div className="text-xl font-semibold">{quiz.nombre}</div>
          {quiz.main_subcategory && (
            <p className="text-md font-medium">{quiz.main_subcategory.nombre}</p>
          )}
        </div>
        <div className="flex flex-col items-start">
          <p className="text-md font-medium">{quiz.cantidad_preguntas} preguntas</p>
          <p className="text-gray-400">Tiempo estimado: {quiz.tiempo_estimado} min</p>
        </div>
      </div>
      <div className="flex items-center justify-center ml-4">
        <button
          className={`btn rounded-xl h-20 w-20 flex items-center justify-center p-0 min-h-0 ${difficultyColor}`}
          onClick={handleStartQuiz}
          disabled={locked}
        >
          <ChevronRight color="white" size={70} />
        </button>
      </div>
    </div>
  );
});

const CategoriesPanel = React.memo(
  ({ onApplySubcategoryFilters, onClearSubcategoryFilters }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [temarioM1, setTemarioM1] = useState([]);
    const [temarioM2, setTemarioM2] = useState([]);
    const [currentSelectedSubcategories, setCurrentSelectedSubcategories] =
      useState(new Set());
    const [appliedSubcategories, setAppliedSubcategories] = useState(new Set());

    const changesDetected = useMemo(
      () => !areSetsEqual(currentSelectedSubcategories, appliedSubcategories),
      [currentSelectedSubcategories, appliedSubcategories]
    );

    useEffect(() => {
      let mounted = true;
      const loadCategoriesAndSubcategories = async () => {
        setLoading(true);
        setError(null);
        try {
          const [subCategoriesData, categoriesData] = await Promise.all([
            getSubCategorias(),
            getCategorias(),
          ]);
          const subCategoriesMap = subCategoriesData.reduce((acc, subCat) => {
            if (!acc[subCat.id_categoria]) {
              acc[subCat.id_categoria] = [];
            }
            acc[subCat.id_categoria].push(subCat);
            return acc;
          }, {});

          const m1Categories = [];
          const m2Categories = [];

          categoriesData.forEach((cat) => {
            const categoryWithSub = {
              ...cat,
              subcategories: subCategoriesMap[cat.id_categoria] || [],
            };
            if (cat.paes === "M1") {
              m1Categories.push(categoryWithSub);
            } else if (cat.paes === "M2") {
              m2Categories.push(categoryWithSub);
            }
          });

          m1Categories.sort((a, b) => a.nombre.localeCompare(b.nombre));
          m2Categories.sort((a, b) => a.nombre.localeCompare(b.nombre));

          if (mounted) {
            setTemarioM1(m1Categories);
            setTemarioM2(m2Categories);
          }
        } catch (err) {
          console.error("Error al cargar categorías y subcategorías:", err);
          if (mounted)
            setError("Error al cargar el temario. Inténtalo de nuevo más tarde.");
        } finally {
          if (mounted) setLoading(false);
        }
      };

      loadCategoriesAndSubcategories();
      return () => {
        mounted = false;
      };
    }, []);

    const handleCheckboxChange = useCallback((subCatId, isChecked) => {
      setCurrentSelectedSubcategories((prev) => {
        const newSet = new Set(prev);
        if (isChecked) {
          newSet.add(subCatId);
        } else {
          newSet.delete(subCatId);
        }
        return newSet;
      });
    }, []);

    const handleApplyFilters = useCallback(() => {
      setAppliedSubcategories(new Set(currentSelectedSubcategories));
      onApplySubcategoryFilters &&
        onApplySubcategoryFilters(Array.from(currentSelectedSubcategories));
    }, [currentSelectedSubcategories, onApplySubcategoryFilters]);

    const handleClearFilters = useCallback(() => {
      setCurrentSelectedSubcategories(new Set());
      setAppliedSubcategories(new Set());
      onClearSubcategoryFilters && onClearSubcategoryFilters();
    }, [onClearSubcategoryFilters]);

    if (loading) {
      return (
        <ul className="menu menu-sm bg-white rounded-box w-75 h-500 p-4">
          <div className="w-50 h-8 bg-gray-200 animate-pulse rounded my-1"></div>
          <div className="w-40 h-5 bg-gray-200 animate-pulse rounded my-2"></div>
          <div className="w-65 h-300 bg-gray-200 animate-pulse rounded my-1"></div>
        </ul>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <Alert type="error" message={error} />
        </div>
      );
    }

    return (
      <ul className="menu menu-sm bg-white rounded-box w-75 p-4">
        <li className="menu-title text-gray-800 text-lg font-bold">
          Categorías
        </li>
        <li className="menu-title text-gray-800 text-md font-bold mt-2">
          Temario M1
        </li>
        {temarioM1.length > 0 ? (
          temarioM1.map((category) => (
            <CategoryMenuItem
              key={category.id_categoria}
              category={category}
              currentSelectedSubcategories={currentSelectedSubcategories}
              onCheckboxChange={handleCheckboxChange}
            />
          ))
        ) : (
          <li>
            <a className="text-gray-500">
              No hay categorías disponibles para Temario M1.
            </a>
          </li>
        )}
        <li className="menu-title text-gray-800 text-md font-bold mt-4">
          Temario M2
        </li>
        {temarioM2.length > 0 ? (
          temarioM2.map((category) => (
            <CategoryMenuItem
              key={category.id_categoria}
              category={category}
              currentSelectedSubcategories={currentSelectedSubcategories}
              onCheckboxChange={handleCheckboxChange}
            />
          ))
        ) : (
          <li>
            <a className="text-gray-500">
              No hay categorías disponibles para Temario M2.
            </a>
          </li>
        )}
        <button
          className="btn btn-primary btn-sm my-3"
          onClick={handleApplyFilters}
          disabled={!changesDetected}
        >
          Aplicar Filtros
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleClearFilters}
          disabled={
            currentSelectedSubcategories.size === 0 &&
            appliedSubcategories.size === 0
          }
        >
          Borrar Filtros
        </button>
      </ul>
    );
  }
);

const QuizzesList = React.memo(
  ({ searchTerm, selectedCategories, setSearchTerm }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let mounted = true;
      const fetchQuizzes = async () => {
        try {
          const data = await getQuizzes();
          if (mounted) setQuizzes(data);
        } catch (err) {
          if (mounted) setError("Error al cargar los quizzes");
          console.error("Error fetching quizzes:", err);
        } finally {
          if (mounted) setLoading(false);
        }
      };
      fetchQuizzes();
      return () => {
        mounted = false;
      };
    }, []);

    const filteredQuizzes = useMemo(() => {
      let results = quizzes;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter((quiz) =>
          quiz.nombre.toLowerCase().includes(term)
        );
      }
      if (selectedCategories.length > 0) {
        results = results.filter((quiz) =>
          selectedCategories.includes(quiz.main_subcategory.id)
        );
      }
      return results;
    }, [searchTerm, selectedCategories, quizzes]);

    if (loading) {
      return (
        <div className="my-8">
          <p className="text-3xl font-bold my-1">Quizzes</p>
          <div className="w-50 h-8 bg-gray-200 animate-pulse rounded my-2" />
          <div className="grid grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 h-48 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="my-8">
          <Alert type="error" message={error} />
        </div>
      );
    }

    return (
      <>
        <div className="my-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div>
              <p className="text-3xl font-bold">Quizzes</p>
              <p className="text-md font-semibold">
                Mostrando {filteredQuizzes.length} de {quizzes.length} resultados
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto flex">
            <label
              htmlFor="categories-drawer"
              className="btn btn-square btn-sm lg:hidden mr-5 w-10 h-10"
            >
              <Menu className="w-5 h-5" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full md:w-64 xl:w-128 h-10">
              <input
                type="search"
                className="grow"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 opacity-70" />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id_quiz} quiz={quiz} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg">No se encontraron quizzes</p>
            </div>
          )}
        </div>
      </>
    );
  }
);

function MainSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <main className="bg-white">
      <div className="relative overflow-hidden">
        <PanelSec />
      </div>
      <div className="drawer lg:drawer-open bg-gray-100">
        <input id="categories-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4">
          <QuizzesList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategories={selectedCategories}
          />
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="categories-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="bg-white lg:bg-gray-100 min-h-full w-auto py-4 lg:p-4">
            <div className="flex justify-between items-center mb-4">
              <label
                htmlFor="categories-drawer"
                className="btn btn-ghost btn-sm lg:hidden"
              >
                <X className="w-5 h-5" />
              </label>
            </div>
            <CategoriesPanel
              onApplySubcategoryFilters={setSelectedCategories}
              onClearSubcategoryFilters={() => setSelectedCategories([])}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

const QuizzesMenu = () => (
  <>
    <MainSection />
    <Footer />
  </>
);

export default QuizzesMenu;
