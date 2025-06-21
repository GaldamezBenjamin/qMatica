import { useUser } from "../../../context/UserContext";
import mainBg from "../../../assets/images/main3.png";
import avatarUrl from "../../../assets/images/avatar.png";
import {
  Crown,
  Mail,
  Lock,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Eye,
  EyeOff,
  Download,
  User,
} from "lucide-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getUserStats, getSubCategoriaByID, updateUserBase, disableUserAccount } from "../../../helpers/apiHelpers";
import Footer from "../../shared/Footer";
import { useAuth } from "../../../context/AuthContext";
import {
  signOut,
  getAuth,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./TemplatePDF";
import { formatDate } from "date-fns";
import { Link } from "react-router";

// --- UserProfile principal ---
const UserProfile = () => {
  return (
    <div
      className="top-0 left-0 w-full h-full z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      <MainSection />
      <Footer />
    </div>
  );
};

export default UserProfile;

const MainSection = () => {
  const { userData } = useUser();

  const fechaRegistro = userData?.fecha_registro
    ? dayjs(userData.fecha_registro._seconds * 1000).format("DD/MM/YYYY")
    : "N/A";
  const expActual = userData?.exp?.actual || 0;
  const expAnterior = userData?.exp?.anterior || 0;
  const fechaSuscripcion = userData?.suscripcion?.fecha_inicio
    ? dayjs(userData.suscripcion.fecha_inicio._seconds * 1000).format(
        "DD/MM/YYYY"
      )
    : "N/A";

  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-start px-7 py-10 bg-gray-100 w-full max-w-[85%] mx-auto">
        <h1 className="text-3xl font-bold mt-2 mb-7 text-center">
          Perfil de Usuario
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <PanelUsuario
              userData={userData}
              rangoActual={getRangoData(expActual)}
              fechaRegistro={
                userData?.fecha_registro
                  ? dayjs(userData.fecha_registro._seconds * 1000).format(
                      "DD/MM/YYYY"
                    )
                  : "N/A"
              }
              onEdit={() => setShowEditModal(true)}
            />
          </div>
          <div className="flex flex-col gap-6 h-full">
            <PanelEXP expActual={expActual} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <PanelStats userData={userData} />
          </div>
          <div className="flex flex-col gap-6 h-full">
            <PanelLegacy
              expAnterior={expAnterior}
              fechaSuscripcion={fechaSuscripcion}
            />
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditModal
          email={userData?.email}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

// --- Utilidades ---
const getRangoData = (exp) => {
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
};

const formatMMSS = (seconds) => {
  if (!seconds || isNaN(seconds)) return "-";
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
};

// --- PanelUsuario ---
function PanelUsuario({ userData, rangoActual, fechaRegistro, onEdit }) {
  const { isSubscribed } = useAuth();
  const username = userData?.username || "Usuario";
  const email = userData?.email || "correo@ejemplo.com";

  return (
    <div className="grid grid-cols-1 gap-6 bg-base-100 rounded-xl shadow p-6 h-full">
      <div className="flex justify-center relative">
        <div
          className="avatar"
          style={{
            background: `linear-gradient(135deg, ${rangoActual.gradFrom}, ${rangoActual.gradTo})`,
            padding: "4px",
            borderRadius: "10%",
          }}
        >
          <div className="w-24 h-24 rounded bg-white flex items-center justify-center relative overflow-hidden">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded object-cover"
            />
          </div>
        </div>
        {isSubscribed && (
          <span
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "-21px",
              zIndex: 10,
            }}
          >
            <Crown size={38} className="drop-shadow" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{username}</span>
        <span className="text-sm text-gray-500">
          Te uniste el {fechaRegistro}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="flex items-center gap-2 text-base">
          <Mail size={16} /> {email}
        </span>
        <span className="flex items-center gap-2 text-base mt-2">
          <Lock size={16} /> ********
        </span>
      </div>
      <div className="flex justify-center items-center">
        <button className="btn btn-primary w-full" onClick={onEdit}>
          <Edit2 size={18} className="mr-2" />
          Editar datos
        </button>
      </div>
    </div>
  );
}

// --- PanelStats ---
function PanelStats({ userData }) {
  const [stats, setStats] = useState(null);
  const [categoriasIncorrectas, setCategoriasIncorrectas] = useState([]);
  const { isSubscribed } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (userData?.id) {
      getUserStats(userData.id).then((s) => {
        if (mounted) setStats(s);
      });
    }
    return () => {
      mounted = false;
    };
  }, [userData?.id]);

  const expActual = userData?.exp?.actual || 0;
  const rangoActual = getRangoData(expActual);
  const expMin =
    rangoActual.nombre === "Bronce"
      ? 0
      : rangoActual.nombre === "Plata"
      ? 6000
      : 12000;
  const expMax =
    rangoActual.nombre === "Bronce"
      ? 6000
      : rangoActual.nombre === "Plata"
      ? 12000
      : expActual;

  const quizzesCompletados = stats?.quizzes_completados ?? "-";
  const totalCorrectas = Array.isArray(stats?.respuestas_por_categoria)
    ? stats.respuestas_por_categoria.reduce(
        (acc, cat) => acc + (cat.correctas || 0),
        0
      )
    : "-";
  const totalIncorrectas = Array.isArray(stats?.respuestas_por_categoria)
    ? stats.respuestas_por_categoria.reduce(
        (acc, cat) => acc + (cat.incorrectas || 0),
        0
      )
    : "-";
  const tiempoPromedioSeg = stats?.tiempo_promedio ?? null;

  const formatMMSS = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "-";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const tiempoPromedioMMSS = tiempoPromedioSeg
    ? formatMMSS(tiempoPromedioSeg)
    : "-";

  useEffect(() => {
    let ignore = false;
    async function fetchCategorias() {
      if (!Array.isArray(stats?.respuestas_por_categoria)) {
        setCategoriasIncorrectas([]);
        return;
      }
      const top = [...stats.respuestas_por_categoria]
        .sort((a, b) => (b.incorrectas || 0) - (a.incorrectas || 0))
        .filter((cat) => cat.incorrectas > 0)
        .slice(0, 2);

      const catsWithNames = await Promise.all(
        top.map(async (cat) => {
          let nombre = cat.nombre_subcategoria;
          let img = cat.img_categoria;
          if (!nombre || !img) {
            try {
              const subcat = await getSubCategoriaByID(cat.id_subcategoria);
              nombre = subcat?.nombre || cat.id_subcategoria;
              img = subcat?.img || undefined;
            } catch {
              nombre = cat.id_subcategoria;
              img = undefined;
            }
          }
          return { ...cat, nombre, img };
        })
      );
      if (!ignore) setCategoriasIncorrectas(catsWithNames);
    }
    fetchCategorias();
    return () => {
      ignore = true;
    };
  }, [stats]);

  return (
    <div className="bg-base-100 rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Estadísticas</h3>
        <PDFDownloadLink
          document={
            <MyDocument
              data={{
                username:
                  userData.username || userData.displayName || "Usuario",
                email: userData.email,
                exp: {
                  actual: expActual,
                  rango: getRangoData(expActual).nombre,
                  progreso: Math.floor(
                    ((expActual - expMin) / (expMax - expMin)) * 100
                  ),
                  siguienteRango: expMax === 6000 ? "Plata" : "Oro",
                  expRequerida: expMax,
                },
                stats: {
                  quizzesCompleted: quizzesCompletados,
                  totalCorrectas: totalCorrectas,
                  totalIncorrectas: totalIncorrectas,
                  tiempoPromedio: tiempoPromedioMMSS,
                  totalTiempo: stats?.total_tiempo
                    ? formatMMSS(stats.total_tiempo)
                    : "-",
                  ultimaActualizacion: stats?.ultima_actualizacion
                    ? formatDate(
                        new Date(stats.ultima_actualizacion._seconds * 1000),
                        "dd/MM/yyyy"
                      )
                    : "N/A",
                  categoriasIncorrectas: categoriasIncorrectas,
                },
              }}
              isSubscribed={!isSubscribed}
            />
          }
          fileName={`rendimiento_${userData.username || "usuario"}.pdf`}
        >
          {({ loading }) => (
            <button className="btn btn-primary btn-sm gap-2">
              <Download size={16} />
              {loading ? "Generando..." : "Descargar PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
      {/* ... (el resto de tu HTML del PanelStats sigue igual) ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gray-100 p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-qmat1">
            {quizzesCompletados}
          </span>
          <span className="text-sm text-gray-600 text-center">
            Quizzes completados
          </span>
        </div>
        <div className="card bg-gray-100 p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-success">
            {totalCorrectas}
          </span>
          <span className="text-sm text-gray-600 text-center">
            Total respuestas correctas
          </span>
        </div>
        <div className="card bg-gray-100 p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-error">
            {totalIncorrectas}
          </span>
          <span className="text-sm text-gray-600 text-center">
            Total respuestas incorrectas
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ul className="list bg-gray-100 rounded-box">
            <li className="p-4 pb-2 text-base font-semibold text-center">
              Categorías con más respuestas incorrectas
            </li>
            {categoriasIncorrectas.length === 0 ? (
              <li className="text-sm text-gray-500 px-4 py-2">
                Sin respuestas incorrectas registradas
              </li>
            ) : (
              categoriasIncorrectas.map((cat, idx) => (
                <li key={cat.id_subcategoria || idx} className="list-row">
                  <div className="text-2xl font-medium opacity-30 text-center w-10 flex items-center justify-center">
                    {(idx + 1).toString().padStart(2, "#")}
                  </div>
                  <div className="list-col-grow flex items-center">
                    <div>
                      {cat.nombre || cat.id_subcategoria || "Subcategoría"}
                    </div>
                  </div>
                  <span className="btn btn-square btn-ghost pointer-events-none select-none">
                    <span className="text-lg font-bold text-error">
                      {cat.incorrectas}
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-box p-4 h-full">
          <span className="text-sm font-semibold mb-1 text-center">
            Tiempo promedio en completar quizzes
          </span>
          <span className="text-2xl font-bold">{tiempoPromedioMMSS}</span>
        </div>
      </div>
    </div>
  );
}

// --- PanelEXP ---
function PanelEXP({ expActual }) {
  const rangoActual = getRangoData(expActual);
  const expMax =
    rangoActual.nombre === "Bronce"
      ? 6000
      : rangoActual.nombre === "Plata"
      ? 12000
      : expActual;
  const expMin =
    rangoActual.nombre === "Bronce"
      ? 0
      : rangoActual.nombre === "Plata"
      ? 6000
      : 12000;
  const percent =
    rangoActual.nombre === "Plata"
      ? Math.floor(((expActual - expMin) / (expMax - expMin)) * 100)
      : Math.floor((expActual / expMax) * 100);

  return (
    <div className="bg-base-100 rounded-xl shadow p-6 h-full flex flex-col justify-center">
      <div className="flex flex-col items-center">
        <p className="font-bold text-lg mb-2">Progreso de EXP</p>
        <div
          className="w-16 h-20 flex items-center justify-center mb-2"
          style={{
            background: `linear-gradient(to bottom right, ${rangoActual.gradFrom}, ${rangoActual.gradTo})`,
            clipPath: "polygon(100% 0, 100% 85.9%, 48% 100%, 0 85.9%, 0 0)",
          }}
        >
          <span
            className="text-5xl font-extrabold"
            style={{ color: rangoActual.letraColor }}
          >
            {rangoActual.icono}
          </span>
        </div>
        <span
          className="text-xl font-bold mb-1"
          style={{ color: rangoActual.letraColor }}
        >
          {rangoActual.nombre}
        </span>
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold">{expMin}</span>
            <span className="font-bold">{expMax}</span>
          </div>
          <div className="relative w-full h-3 rounded-xl overflow-hidden">
            {/* Barra de fondo (gris, porcentaje dinámico) */}
            <div className="absolute left-0 top-0 h-full w-full bg-gray-100 z-0" />
            {/* Barra superior (degradado, progreso actual) */}
            <div
              className="absolute left-0 top-0 h-full rounded-2xl z-20"
              style={{
                width: `${percent}%`,
                background: `linear-gradient(to bottom right, ${rangoActual.gradFrom}, ${rangoActual.gradTo})`,
                opacity: 1,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
          <div className="text-center text-xl font-bold mt-3">{percent}%</div>
        </div>
      </div>
    </div>
  );
}

// --- PanelLegacy ---
function PanelLegacy({ expAnterior, fechaSuscripcion }) {
  const { isSubscribed } = useAuth();
  const rangoAnterior = getRangoData(expAnterior);
  return (
    <div className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-4 h-full justify-center">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold">EXP anterior</span>
        <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center w-full mb-1">
          <span className="text-lg font-bold">{expAnterior} EXP</span>
        </div>
        <span className="text-lg mt-1">
          Rango:{" "}
          <span style={{ color: rangoAnterior.letraColor, fontWeight: "bold" }}>
            {rangoAnterior.nombre}
          </span>
        </span>
        <div
          className="w-11 h-14 flex items-center justify-center my-1"
          style={{
            background: `linear-gradient(to bottom right, ${rangoAnterior.gradFrom}, ${rangoAnterior.gradTo})`,
            clipPath: "polygon(100% 0, 100% 85.9%, 48% 100%, 0 85.9%, 0 0)",
          }}
        >
          <span
            className="text-3xl font-extrabold"
            style={{ color: rangoAnterior.letraColor }}
          >
            {rangoAnterior.icono}
          </span>
        </div>
      </div>
      <div className="divider my-0.5"></div>
      <div className="flex flex-col items-center">
        {isSubscribed ? (
          <>
            <span className="text-base font-semibold">
              Fecha de suscripción
            </span>
            <span className="text-sm text-gray-500">{fechaSuscripcion}</span>
            <Link to="/subscripcion" className="btn btn-outline btn-secondary btn-sm mt-2">
              Editar suscripción
            </Link>
          </>
        ) : (
          <>
            <span className="text-center text-base font-semibold mb-2">
              ¡Potencia tu preparación!
            </span>
            <span className="text-center text-sm text-gray-500">
              Suscríbete y elimina las restricciones de dificultad, obteniendo
              acceso total a todos los Quizzes.
            </span>
            <button className="btn btn-primary btn-sm mt-2">Suscríbete</button>
          </>
        )}
      </div>
    </div>
  );
}

function EditModal({ email, onClose }) {
  const [step, setStep] = useState("choose"); // choose | email | username | password | disable
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    currentPassword: "",
    newEmail: "",
    newUsername: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [disableLoading, setDisableLoading] = useState(false);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const { clearUserData, refreshUserData } = useUser();
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  // Maneja cambios de input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reautenticación
  const reauthenticateUser = async () => {
    if (!user) {
      throw new Error("Usuario no autenticado.");
    }
    
    const isPasswordProvider = user.providerData.some(
      (provider) => provider.providerId === "password"
    );

    if (!isPasswordProvider) {
      if (form.currentPassword) {
        throw new Error(
          "No se requiere contraseña para cuentas de Google/Facebook/etc."
        );
      }
      return;
    }

    if (!user.email) {
      throw new Error("Tu cuenta no tiene un correo principal asociado.");
    }
    if (!form.currentPassword) {
      throw new Error(
        "Debes ingresar tu contraseña actual para reautenticarte."
      );
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      form.currentPassword
    );
    await reauthenticateWithCredential(user, credential);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validación de nombre de usuario
  const isValidUsername = (username) => {
    return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  // Cambiar nombre de usuario
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    
    if (!isValidUsername(form.newUsername)) {
      toast.error("El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números y guiones bajos.");
      return;
    }

    setLoading(true);
    try {
      // Solo requerir reautenticación si es un proveedor de contraseña
      const isPasswordProvider = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      
      if (isPasswordProvider) {
        await reauthenticateUser();
      }

      // Actualizar en la base de datos
      await updateUserBase(user.uid, {
        username: form.newUsername
      });
      
      toast.success("Nombre de usuario actualizado correctamente.");

      refreshUserData();
      onClose();
    } catch (err) {
      console.error("Error updating username:", err);
      let msg = "Error al actualizar nombre de usuario.";
      if (err.code === "auth/wrong-password") {
        msg = "La contraseña actual es incorrecta.";
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar correo
  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.newEmail)) {
      toast.error("Ingresa un correo válido.");
      return;
    }

    if (form.newEmail === user.email) {
      toast.info("El nuevo correo es el mismo que el actual.");
      onClose();
      return;
    }

    setLoading(true);
    try {
      await reauthenticateUser();
      await updateEmail(user, form.newEmail);
      
      // Actualizar también en la base de datos si es necesario
      await updateUserBase(user.uid, {
        email: form.newEmail
      });
      
      toast.success(
        "Correo actualizado correctamente. Por favor, inicia sesión con tu nuevo correo electrónico."
      );

      await signOut(auth);
      clearUserData();
      navigate("/");
      onClose();
    } catch (err) {
      console.error("Error updating email:", err);
      let msg = "Error al actualizar correo.";
      if (err.code === "auth/email-already-in-use") {
        msg = "El correo ya está en uso por otra cuenta.";
      } else if (err.code === "auth/invalid-email") {
        msg = "El formato del correo no es válido.";
      } else if (err.code === "auth/requires-recent-login") {
        msg = "Por seguridad, vuelve a iniciar sesión e inténtalo de nuevo.";
      } else if (err.code === "auth/wrong-password") {
        msg = "La contraseña actual es incorrecta.";
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    if (form.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await reauthenticateUser();
      await updatePassword(user, form.newPassword);
      toast.success(
        "Contraseña actualizada correctamente. Por favor, vuelve a iniciar sesión."
      );

      await signOut(auth);
      clearUserData();
      navigate("/");
      onClose();
    } catch (err) {
      console.error("Error updating password:", err);
      let msg = "Error al actualizar contraseña.";
      if (err.code === "auth/weak-password") {
        msg = "La contraseña es demasiado débil.";
      } else if (err.code === "auth/requires-recent-login") {
        msg = "Por seguridad, vuelve a iniciar sesión e inténtalo de nuevo.";
      } else if (err.code === "auth/wrong-password") {
        msg = "La contraseña actual es incorrecta.";
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Desactivar cuenta
  const handleDisableAccount = async () => {
    setDisableLoading(true);
    try {
      await disableUserAccount(user.uid);
      toast.success("Cuenta desactivada correctamente.");
      await signOut(auth);
      clearUserData();
      navigate("/");
      onClose();
    } catch (err) {
      toast.error("No se pudo desactivar la cuenta.");
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-gray-200">
        {step === "choose" && (
          <button
            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}

        {step === "choose" && (
          <div className="flex flex-col gap-6 items-center">
            <div className="text-center">
              <Mail className="w-10 h-10 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Editar información
              </h2>
              <p className="text-gray-500 mt-1">
                Selecciona qué deseas actualizar
              </p>
            </div>

            <div className="w-full space-y-3">
              <button
                className="btn btn-outline w-full justify-start gap-3 py-4 px-6 hover:bg-primary/10"
                onClick={() => {
                  const isPasswordProvider = user?.providerData.some(
                    (provider) => provider.providerId === "password"
                  );
                  if (user && !isPasswordProvider) {
                    toast.info(
                      "No puedes cambiar el correo directamente si tu cuenta es de Google/Facebook. Gestiona desde ese proveedor."
                    );
                    return;
                  }
                  setStep("email");
                }}
              >
                <Mail className="w-5 h-5" />
                <span className="flex-1 text-left">
                  Cambiar correo electrónico
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                className="btn btn-outline w-full justify-start gap-3 py-4 px-6 hover:bg-secondary/10"
                onClick={() => setStep("username")}
              >
                <User className="w-5 h-5" />
                <span className="flex-1 text-left">Cambiar nombre de usuario</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                className="btn btn-outline w-full justify-start gap-3 py-4 px-6 hover:bg-secondary/10"
                onClick={() => {
                  const isPasswordProvider = user?.providerData.some(
                    (provider) => provider.providerId === "password"
                  );
                  if (user && !isPasswordProvider) {
                    toast.info(
                      "No puedes cambiar la contraseña directamente si tu cuenta es de Google/Facebook. Gestiona desde ese proveedor."
                    );
                    return;
                  }
                  setStep("password");
                }}
              >
                <Lock className="w-5 h-5" />
                <span className="flex-1 text-left">Cambiar contraseña</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex justify-center mt-6">
              <button
                className="btn btn-outline btn-error w-full"
                onClick={() => setStep("disable")}
                disabled={disableLoading}
              >
                <X className="w-5 h-5" />
                Desactivar cuenta
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmación para desactivar cuenta */}
        {step === "disable" && (
          <div className="flex flex-col gap-6 items-center">
            <div className="flex items-center gap-3 mb-2 w-full">
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setStep("choose")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Desactivar cuenta
              </h2>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-error mb-2">
                ¿Estás seguro de que deseas desactivar tu cuenta?
              </p>
              <p className="text-gray-600 mb-4">
                Esta acción es <span className="font-bold">irreversible</span> y no podrás volver a iniciar sesión con este usuario.
              </p>
            </div>
            <div className="w-full flex gap-3">
              <button
                className="btn btn-outline flex-1"
                onClick={() => setStep("choose")}
                disabled={disableLoading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-error flex-1 gap-2"
                onClick={handleDisableAccount}
                disabled={disableLoading}
              >
                {disableLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <X className="w-5 h-5" />
                )}
                {disableLoading ? "Desactivando..." : "Desactivar"}
              </button>
            </div>
          </div>
        )}

        {step === "email" && (
          <form className="flex flex-col gap-5" onSubmit={handleEmailChange}>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setStep("choose")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Cambiar correo
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Nuevo correo electrónico</span>
                </label>
                <input
                  type="email"
                  name="newEmail"
                  className="input input-bordered w-full"
                  placeholder="tucorreo@ejemplo.com"
                  value={form.newEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Contraseña actual</span>
                </label>
                <div className="join w-full">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    className="input input-bordered join-item w-full"
                    placeholder="••••••••"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn join-item"
                    onClick={() => togglePassword("current")}
                  >
                    {showPassword.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={() => setStep("choose")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        )}

        {step === "username" && (
          <form className="flex flex-col gap-5" onSubmit={handleUsernameChange}>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setStep("choose")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Cambiar nombre de usuario
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Nuevo nombre de usuario</span>
                </label>
                <input
                  type="text"
                  name="newUsername"
                  className="input input-bordered w-full"
                  placeholder="nuevo_usuario"
                  value={form.newUsername}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <span className="label-text-alt">3-30 caracteres, solo letras, números y _</span>
                </label>
              </div>

              {user?.providerData.some(provider => provider.providerId === "password") && (
                <div>
                  <label className="label">
                    <span className="label-text">Contraseña actual</span>
                  </label>
                  <div className="join w-full">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      className="input input-bordered join-item w-full"
                      placeholder="••••••••"
                      value={form.currentPassword}
                      onChange={handleChange}
                      required={user?.providerData.some(provider => provider.providerId === "password")}
                    />
                    <button
                      type="button"
                      className="btn join-item"
                      onClick={() => togglePassword("current")}
                    >
                      {showPassword.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={() => setStep("choose")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form className="flex flex-col gap-5" onSubmit={handlePasswordChange}>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setStep("choose")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Cambiar contraseña
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Nueva contraseña</span>
                </label>
                <div className="join w-full">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    className="input input-bordered join-item w-full"
                    placeholder="••••••••"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn join-item "
                    onClick={() => togglePassword("new")}
                  >
                    {showPassword.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Confirmar nueva contraseña</span>
                </label>
                <div className="join w-full">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    className="input input-bordered join-item w-full"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn join-item"
                    onClick={() => togglePassword("confirm")}
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Contraseña actual</span>
                </label>
                <div className="join w-full">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    className="input input-bordered join-item w-full"
                    placeholder="••••••••"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn join-item"
                    onClick={() => togglePassword("current")}
                  >
                    {showPassword.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={() => setStep("choose")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}