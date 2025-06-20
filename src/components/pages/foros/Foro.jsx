import React, { useEffect, useState, useRef } from "react";
import Footer from "../../shared/Footer";
import {
  getMensajesFromForo,
  getUserProfile,
  getForoByID,
  createMensajeForo,
  updateMensajeForo,
  deleteMensajeForo,
} from "../../../helpers/apiHelpers";
import { createForumMessageSchema, updateForumMessageSchema } from "../../../schemas/mensajeForoSchemas";
import { useParams } from "react-router";
import {
  MessageSquare,
  Send,
  Loader2,
  ArrowDownToLine,
  Plus,
} from "lucide-react";
import avatarUrl from "../../../assets/images/avatar.png";
import { formatDate } from "date-fns";
import { useUser } from "../../../context/UserContext";

// --- Utilidad para formato de fecha ---
function fechaFormato(value) {
  if (
    typeof value === "object" &&
    value._seconds !== undefined &&
    value._nanoseconds !== undefined
  ) {
    return formatDate(
      new Date(value._seconds * 1000 + value._nanoseconds / 1000000),
      "dd/MM/yyyy pp"
    );
  }
  return "-";
}

// --- ForoTitle: Encabezado del foro ---
function ForoTitle({ foro, autor, onGoToLastPost, onNewPost, disableLastPost }) {
  // Obtener rango para color y gradiente
  const rango = autor?.exp
    ? getRangoData(autor.exp.actual || 0)
    : getRangoData(0);

  return (
    <div className="w-full flex flex-col md:flex-row bg-base-100 rounded-xl shadow p-6 mb-8 gap-6 items-center">
      {/* Columna 1: ícono y id */}
      <div className="flex flex-col items-center min-w-[70px]">
        <MessageSquare size={38} className="text-qmat1 mb-2" />
        <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-0.5">
          {foro?.id_foro || "-"}
        </span>
      </div>
      {/* Columna 2: título, descripción, fecha */}
      <div className="flex-1 min-w-0 w-full">
        <div className="text-2xl md:text-3xl font-bold text-black mb-1 break-words">
          {foro?.titulo || "Foro"}
        </div>
        <div className="text-gray-600 text-base mb-2 break-words">
          {foro?.descripcion}
        </div>
        <div className="text-xs text-gray-400">
          Creado el: {fechaFormato(foro?.fecha_creacion) || "-"}
        </div>
      </div>
      {/* Columna 3: autor y botones */}
      <div className="flex flex-col items-end min-w-[160px] gap-2 w-full md:w-auto">
        <span className="flex items-center gap-2 font-semibold text-lg mb-1">
          {/* Nombre con color de rango */}
          <span className="text-sm" style={{ color: rango.letraColor }}>
            {autor?.username || "Autor"}
          </span>
          {/* Avatar pequeño */}
          <span
            className="avatar"
            style={{
              background: `linear-gradient(135deg, ${rango.gradFrom}, ${rango.gradTo})`,
              padding: "2px",
              borderRadius: "15%",
            }}
          >
            <span className="w-7 h-7 rounded bg-white flex items-center justify-center overflow-hidden">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-7 h-7 rounded object-cover"
              />
            </span>
          </span>
        </span>
        <button
          className="btn btn-outline btn-primary btn-sm w-full flex items-center gap-2 mb-1"
          onClick={onGoToLastPost}
          disabled={disableLastPost}
        >
          <ArrowDownToLine size={16} /> Ir al último post
        </button>
        <button
          className="btn btn-primary btn-sm w-full flex items-center gap-2"
          onClick={onNewPost}
        >
          <Plus size={16} /> Publicar un post
        </button>
      </div>
    </div>
  );
}

// --- ForoPost: Un post individual ---
// --- ForoPost: Un post individual ---
function ForoPost({ post, index, autor, onPostDeleted }) {
  const { userData } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(post?.contenido || "");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Función para eliminar el post
  const handleDelete = async () => {
    if (!post?.id_mensaje) return;
    setDeleteLoading(true);
    try {
      await deleteMensajeForo(post.id_mensaje);
      // Llama a la función de callback para notificar al padre
      if (onPostDeleted) onPostDeleted(post.id_mensaje);
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      window?.toast?.error
        ? window.toast.error("No se pudo eliminar el post")
        : alert("No se pudo eliminar el post");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para guardar la edición
  const handleSaveEdit = async () => {
    if (!post?.id_mensaje) return;
    setEditLoading(true);
    try {
      // Validación con el esquema si existe
      let errorMsg = "";
      if (updateForumMessageSchema) {
        try {
          updateForumMessageSchema.parse({ contenido: editContent });
        } catch (err) {
          errorMsg = err?.errors?.[0]?.message || "Contenido inválido";
        }
      } else if (editContent.length < 2) {
        errorMsg = "El mensaje es demasiado corto.";
      }
      if (errorMsg) {
        window?.toast?.error
          ? window.toast.error(errorMsg)
          : alert(errorMsg);
        return;
      }

      await updateMensajeForo(post.id_mensaje, { contenido: editContent });
      setEditMode(false);
      // Actualiza el post localmente
      if (onPostDeleted) {
        // En este caso usamos onPostDeleted para forzar un refresh
        // Podrías crear un callback específico para actualización si prefieres
        onPostDeleted(post.id_mensaje);
      }
    } catch (error) {
      console.error("Error al actualizar el post:", error);
      window?.toast?.error
        ? window.toast.error("No se pudo actualizar el post")
        : alert("No se pudo actualizar el post");
    } finally {
      setEditLoading(false);
    }
  };

  // Resto del componente permanece igual...
  const postNumber = index + 1;
  const fecha = fechaFormato(post?.fecha_creacion) || "-";
  const rango = autor?.exp
    ? getRangoData(autor.exp.actual || 0)
    : getRangoData(0);
  const fechaRegistro = autor?.fecha_registro
    ? new Date(autor.fecha_registro._seconds * 1000).toLocaleDateString()
    : "-";

  return (
    <div className="bg-base-100 rounded-xl shadow p-5 mb-6 min-h-75 flex flex-col gap-3">
      {/* Fila 1: fecha y número de post */}
      <div className="flex flex-row justify-between items-center mb-2">
        <span className="text-xs text-gray-500">{fecha}</span>
        <span className="text-xs text-gray-400">POST #{postNumber}</span>
      </div>
      {/* Fila 2: avatar+autor | mensaje */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Usuario info (responsive: horizontal en mobile, vertical en md+) */}
        <div
          className="
            flex flex-row md:flex-col justify-evenly items-center md:items-center
            min-w-[90px] md:min-w-1/7
            bg-gray-100
            py-2 px-1 md:py-4 md:px-2
            rounded-lg
            w-full md:w-auto
            mb-2 md:mb-0
            "
        >
          {/* Avatar */}
          <div className="flex flex-row md:flex-col items-center ml-2 md:ml-0">
            <div
              className="avatar mb-0 md:mb-2 mr-3 md:mr-0"
              style={{
                background: `linear-gradient(135deg, ${rango.gradFrom}, ${rango.gradTo})`,
                padding: window.innerWidth < 768 ? "2px" : "4px",
                borderRadius: "10%",
              }}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 rounded bg-white flex items-center justify-center relative overflow-hidden">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 md:w-16 md:h-16 rounded object-cover"
                />
              </div>
            </div>
            <span
              className="text-xs md:text-sm font-bold"
              style={{ color: rango.letraColor }}
            >
              {autor?.username || "Usuario"}
            </span>
          </div>
          {/* Nombre y rango */}
          <div className="flex flex-col items-center ml-2 md:ml-0">
            {/* Rango e ícono */}
            <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0 mt-0 md:mt-1">
              <div
                className="w-5 h-7 md:w-6 md:h-8 flex items-center justify-center mt-0 md:mt-2"
                style={{
                  background: `linear-gradient(to bottom right, ${rango.gradFrom}, ${rango.gradTo})`,
                  clipPath: "polygon(100% 0, 100% 85.9%, 48% 100%, 0 85.9%, 0 0)",
                }}
              >
                <span
                  className="text-lg md:text-xl font-extrabold"
                  style={{ color: rango.letraColor }}
                >
                  {rango.icono}
                </span>
              </div>
              <span
                className="text-xs font-semibold md:mb-2"
                style={{ color: rango.letraColor }}
                >
                {rango.nombre}
              </span>
            </div>
          </div>
          {/* Fecha registro */}
          <span className="text-xs text-gray-400 text-center ml-2 md:ml-0 md:mt-2 whitespace-nowrap">
            Se unió el:<br className="hidden md:block" />
            {fechaRegistro}
          </span>
        </div>
        {/* Columna mensaje */}
        <div className="flex-1 flex flex-col gap-2 bg-gray-100 py-6 px-4 md:py-10 md:px-5 rounded-lg">
          {/* Contenido o textarea de edición */}
          {!editMode ? (
            <div className="text-sm md:text-base text-gray-800 break-words">
              {post?.contenido}
            </div>
          ) : (
            <textarea
              className="textarea textarea-bordered w-full min-h-[80px]"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              disabled={editLoading}
            />
          )}
          {/* Nueva fila: botones de editar/eliminar si es el autor */}
          {userData?.id === post.autor_uid && (
            <div className="flex gap-2 mt-2">
              {!editMode ? (
                <>
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => {
                      setEditContent(post?.contenido || "");
                      setEditMode(true);
                    }}
                  >
                    Editar post
                  </button>
                  <button
                    className="btn btn-outline btn-error btn-xs"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Eliminando..." : "Eliminar post"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                  >
                    {editLoading ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setEditMode(false)}
                    disabled={editLoading}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          )}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

// --- Utilidad para rango (igual que en UserProfile) ---
function getRangoData(exp) {
  if (exp >= 12000) {
    return {
      nombre: "Oro",
      gradFrom: "#fad766",
      gradTo: "#d4af37",
      letraColor: "#9b7f29",
      icono: "III",
    };
  }
  if (exp >= 6000) {
    return {
      nombre: "Plata",
      gradFrom: "#e6e6e6",
      gradTo: "#c0c0c0",
      letraColor: "#7b7b7b",
      icono: "II",
    };
  }
  return {
    nombre: "Bronce",
    gradFrom: "#de9c5f",
    gradTo: "#b87333",
    letraColor: "#744920",
    icono: "I",
  };
}

// --- Componente para escribir un nuevo post ---
function NewPostBox({ value, onChange, onPublish, loading }) {
  return (
    <div className="bg-base-100 rounded-xl shadow p-6 mt-4 flex flex-col gap-4 items-end w-full">
      {/* Fila 1: textarea */}
      <div className="w-full">
        <textarea
          className="textarea textarea-bordered flex-1 min-h-[180px] w-full"
          style={{ resize: "none" }}
          placeholder="Escribe tu post aquí..."
          value={value}
          onChange={onChange}
          rows={6}
          maxLength={1000}
          disabled={loading}
        />
      </div>
      {/* Fila 2: botón */}
      <div className="w-full flex justify-end">
        <button
          className="btn btn-primary gap-2 mt-2"
          style={{ minWidth: "140px" }}
          onClick={onPublish}
          disabled={loading || !value.trim()}
          type="button"
        >
          <Send size={18} />
          Publicar
        </button>
      </div>
    </div>
  );
}

// --- MainSection: Layout principal ---
function MainSection() {
  const { id_foro } = useParams();
  const [foro, setForo] = useState(null);
  // Cambia autor a un diccionario de autores por uid
  const [autores, setAutores] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para el recuadro de nuevo post
  const [newPost, setNewPost] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Paginación
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  // Ref para hacer scroll al último post
  const lastPostRef = useRef(null);
  // Ref para hacer scroll a NewPostBox
  const newPostBoxRef = useRef(null);

  // Estado para el popup de salto de página
  const [showPageJump, setShowPageJump] = useState(false);
  const [pageInput, setPageInput] = useState(page);
  const pageJumpRef = useRef();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getForoByID(id_foro)
      .then(async (foroData) => {
        if (!mounted) return;
        setForo(foroData);

        // Obtener los posts y sus autores
        getMensajesFromForo(id_foro)
          .then(async (data) => {
            let postsArr = Array.isArray(data) ? data : [];
            // Obtener todos los autor_uid únicos
            const autorUids = [
              ...new Set(postsArr.map((msg) => msg.autor_uid).filter(Boolean)),
            ];
            // Obtener info de cada autor
            const autoresObj = {};
            await Promise.all(
              autorUids.map(async (uid) => {
                try {
                  const autorData = await getUserProfile(uid);
                  if (autorData) autoresObj[uid] = autorData;
                } catch {
                  // Si falla, no agrega nada
                }
              })
            );
            if (mounted) {
              setPosts(postsArr);
              setAutores(autoresObj);
            }
          })
          .catch(() => {
            if (mounted) setError("Error al cargar los posts del foro.");
          })
          .finally(() => {
            if (mounted) setLoading(false);
          });
      })
      .catch(() => {
        if (mounted) {
          setError("Error al cargar la información del foro.");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id_foro]);

  // Reset page if posts change
  useEffect(() => {
    setPage(1);
  }, [posts.length]);

  // Función para hacer scroll al último post
  const handleGoToLastPost = () => {
    if (posts.length === 0) return;
    const lastPage = Math.ceil(posts.length / POSTS_PER_PAGE);
    if (page !== lastPage) {
      setPage(lastPage);
      // Esperar a que la página cambie y luego hacer scroll
      setTimeout(() => {
        if (lastPostRef.current) {
          lastPostRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    } else {
      if (lastPostRef.current) {
        lastPostRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Función para el botón de publicar (lleva a NewPostBox)
  const handleGoToNewPostBox = () => {
    if (newPostBoxRef.current) {
      newPostBoxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Función para el botón de publicar (con funcionalidad real)
  const handlePublish = async () => {
    if (publishing) return;
    const contenido = newPost.trim();
    // Validación con mensajeForoSchemas si existe
    if (!contenido) return;
    let errorMsg = "";
    if (createForumMessageSchema) {
      try {
        createForumMessageSchema.parse({ contenido, id_foro });
      } catch (err) {
        errorMsg = err?.errors?.[0]?.message || "Contenido inválido";
      }
    } else if (contenido.length < 2) {
      errorMsg = "El mensaje es demasiado corto.";
    }
    if (errorMsg) {
      window?.toast?.error
        ? window.toast.error(errorMsg)
        : alert(errorMsg);
      return;
    }

    setPublishing(true);
    try {
      await createMensajeForo({ contenido, id_foro });
      setNewPost("");
      // Refrescar mensajes
      setLoading(true);
      getMensajesFromForo(id_foro)
        .then((data) => {
          let postsArr = Array.isArray(data) ? data : [];
          setPosts(postsArr);
        })
        .catch(() => setError("Error al cargar los posts del foro."))
        .finally(() => setLoading(false));
    } catch (err) {
      window?.toast?.error
        ? window.toast.error("No se pudo publicar el mensaje.")
        : alert("No se pudo publicar el mensaje.");
    } finally {
      setPublishing(false);
    }
  };

  // Elimina un post del estado local después de borrarlo
  const handlePostDeleted = (id_mensaje) => {
    setPosts((prev) => prev.filter((p) => p.id_mensaje !== id_mensaje));
  };

  // Paginación lógica
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginatedPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  // Renderiza la paginación de daisyUI con puntos suspensivos
  function Pagination() {
    const isPrevDisabled = page === 1 || totalPages === 1;
    const isNextDisabled = page === totalPages || totalPages === 1;

    return (
      <div className="flex justify-end my-4">
        <div className="join relative">
          <button
            className={`join-item btn${isPrevDisabled ? " text-gray-300" : ""}`}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              pointerEvents: isPrevDisabled ? "none" : undefined,
              color: isPrevDisabled ? "#d1d5db" : undefined,
            }}
            type="button"
          >
            «
          </button>
          <button
            className="join-item btn relative"
            onClick={() => {
              setShowPageJump((v) => !v);
              setPageInput(page);
            }}
            type="button"
          >
            Página {page}
            {/* Mini ventana para elegir página */}
            {showPageJump && (
              <div
                ref={pageJumpRef}
                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 bg-base-100 shadow-lg rounded-lg p-3 flex flex-col items-center border"
                style={{ minWidth: 120 }}
              >
                <span className="text-xs mb-2 text-gray-500">
                  Ir a página (1-{totalPages})
                </span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={e => {
                    let val = Number(e.target.value);
                    if (isNaN(val)) val = 1;
                    setPageInput(val);
                  }}
                  className="input input-bordered input-sm w-20 text-center mb-2"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      if (pageInput >= 1 && pageInput <= totalPages) {
                        setPage(pageInput);
                        setShowPageJump(false);
                      }
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => {
                      if (pageInput >= 1 && pageInput <= totalPages) {
                        setPage(pageInput);
                        setShowPageJump(false);
                      }
                    }}
                  >
                    Ir
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setShowPageJump(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </button>
          <button
            className={`join-item btn${isNextDisabled ? " text-gray-300" : ""}`}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{
              pointerEvents: isNextDisabled ? "none" : undefined,
              color: isNextDisabled ? "#d1d5db" : undefined,
            }}
            type="button"
          >
            »
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start px-2 sm:px-4 md:px-7 py-10 w-full max-w-5xl mx-auto bg-gray-100"
    >
      {foro && (
        <ForoTitle
          foro={foro}
          autor={autores[foro?.creador_uid]}
          onGoToLastPost={handleGoToLastPost}
          onNewPost={handleGoToNewPostBox}
          disableLastPost={posts.length === 0}
        />
      )}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-qmat1" size={32} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : posts.length === 0 ? (
          <div className="bg-base-100 rounded-xl shadow p-8 flex flex-col items-center justify-center mb-6">
            <span className="text-xl font-bold text-gray-700 mb-2">
              Parece que no hay posts
            </span>
            <span className="text-sm text-gray-500 mb-4 text-center">
              Sé el primero en postear en este foro.
            </span>
            <div ref={newPostBoxRef}>
              <NewPostBox
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onPublish={handlePublish}
                loading={publishing}
              />
            </div>
          </div>
        ) : (
          <>
            <Pagination />
            {paginatedPosts.map((post, idx) => {
              const globalIdx = (page - 1) * POSTS_PER_PAGE + idx;
              return (
                <div
                  key={post.id_mensaje}
                  ref={globalIdx === posts.length - 1 ? lastPostRef : undefined}
                >
                  <ForoPost
                    post={post}
                    index={globalIdx}
                    autor={autores[post.autor_uid]}
                    onPostDeleted={handlePostDeleted}
                  />
                </div>
              );
            })}
            <Pagination />
            <div ref={newPostBoxRef}>
              <NewPostBox
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onPublish={handlePublish}
                loading={publishing}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Principal ---
export default function Foro() {
  return (
    <div className="top-0 left-0 w-full h-full z-0 animated-gradient-bg">
      <MainSection />
      <Footer />
    </div>
  );
}

// --- Animación de fondo: estilos globales (puedes mover esto a tu CSS global si prefieres) ---
const style = document.createElement("style");
style.innerHTML = `
.animated-gradient-bg {
  background: linear-gradient(270deg, #f0596c, #824894, #f0596c, #824894);
  background-size: 400% 400%;
  animation: qmat-gradient 50s ease-in-out infinite;
}
@keyframes qmat-gradient {
  0% {background-position:0% 50%}
  50% {background-position:100% 50%}
  100% {background-position:0% 50%}
}
`;
if (typeof window !== "undefined" && !document.getElementById("qmat-gradient-style")) {
  style.id = "qmat-gradient-style";
  document.head.appendChild(style);
}
