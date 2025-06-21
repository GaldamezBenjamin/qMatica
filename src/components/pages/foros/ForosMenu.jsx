import React, { useEffect, useState } from "react";
import Footer from "../../shared/Footer";
import main1 from "../../../assets/images/main1.png";
import { getForos, createForo } from "../../../helpers/apiHelpers";
import { Users, MessageSquare, Search, Plus, ChevronRight, X, Loader2, Check } from "lucide-react";
import { formatDate } from "date-fns";
import { Link } from "react-router";
import { createForumSchema } from "../../../schemas/foroSchemas";

// --- Panel: Imagen y título ---
function Panel() {
  return (
    <div
      className="w-full h-40 md:h-56 lg:h-64 bg-cover bg-center relative flex items-center justify-center flex-col px-4"
      style={{ backgroundImage: `url(${main1})` }}
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">Foros</h1>
    </div>
  );
}

// --- ForosList: Lista de foros ---
// Agrega refresh como prop para recargar la lista al crear un foro
function ForosList({ searchTerm, refresh }) {
  const [foros, setForos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getForos()
      .then((data) => {
        if (mounted) setForos(data);
      })
      .catch(() => {
        if (mounted) setError("Error al cargar los foros.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [refresh]);

  const fechaCreacion = (foro) => {
    return (formatDate(new Date(foro?.fecha_creacion._seconds * 1000),"dd/MM/yyyy"));
  }

  const filteredForos = searchTerm
    ? foros.filter((foro) =>
        foro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : foros;

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (filteredForos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No se encontraron foros.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {filteredForos.map((foro) => (
        <li key={foro.id_foro} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-4 min-w-[40px]">
              <MessageSquare className="text-qmat1 mb-1" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={`/foros/foro/${foro.id_foro}`}
                className="text-lg font-semibold text-black hover:underline break-words"
              >
                {foro.titulo}
              </Link>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{foro.descripcion}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                <span>Creado el: {" "}{fechaCreacion(foro)}</span>
                <span
                  className={`font-semibold ${
                    foro.estado === "Activo" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {foro.estado}
                </span>
              </div>
            </div>
            <Link
              to={`/foros/foro/${foro.id_foro}`}
              className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-full w-8 h-8 flex items-center justify-center transition"
              title="Ver foro"
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- MainSection: Panel + búsqueda + lista ---
function MainSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Panel />
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-1/2 flex items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar foros..."
                className="w-full px-4 py-2 border border-gray-300 rounded shadow text-black bg-white focus:outline-none focus:ring-2 focus:ring-qmat1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <button
            className="bg-qmat1 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} /> Crear Foro
          </button>
        </div>
        <ForosList searchTerm={searchTerm} refresh={refresh} />
      </div>
      {showCreateModal && (
        <CreateForoModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setRefresh(r => !r);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

// Modal para crear foro
function CreateForoModal({ onClose, onCreated }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCrear = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    // Validar con schema
    try {
      createForumSchema.parse({ titulo, descripcion });
    } catch (err) {
      setErrorMsg(err?.errors?.[0]?.message || "Datos inválidos");
      return;
    }
    setLoading(true);
    try {
      await createForo({ titulo, descripcion });
      if (onCreated) onCreated();
    } catch (err) {
      setErrorMsg("No se pudo crear el foro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-gray-200">
        <button
          className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <form className="flex flex-col gap-5" onSubmit={handleCrear}>
          <div className="text-center mb-2">
            <Plus className="w-10 h-10 mx-auto text-primary mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Crear nuevo foro
            </h2>
            <p className="text-gray-500 mt-1">
              Ingresa el título y la descripción del foro
            </p>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Título</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Título del foro"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Descripción</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Descripción del foro"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              maxLength={1000}
              style={{ resize: "none" }}
              rows={5}
            />
          </div>
          {errorMsg && (
            <div className="text-error text-sm text-center">{errorMsg}</div>
          )}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
              disabled={loading || !titulo.trim() || !descripcion.trim()}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {loading ? "Creando..." : "Crear foro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Principal ---
export default function ForosMenu() {
  return (
    <>
      <MainSection />
      <Footer />
    </>
  );
}