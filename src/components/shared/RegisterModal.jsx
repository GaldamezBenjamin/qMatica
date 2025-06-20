import { useState } from "react";
import { Link } from "react-router";

import qMatLogo from "../../assets/svg/qMatLogo.svg";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../context/UserContext";

import { auth } from "../../firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterModal = ({ onClose, loginToggle }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUserData } = useUser();

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();

      const profileResponse = await fetch("/api/usuarios/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          username: username,
          email: email,
          rol: "usuario",
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(
          errorData.message || "Error al guardar perfil en el backend."
        );
      }

      const statsResponse = await fetch("/api/estadisticas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          quizzes_completados: 0,
          tiempo_promedio: 0,
          respuestas_por_categoria: [],
        }),
      });

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json();
        throw new Error(
          errorData.message || "Error al crear estadísticas en el backend."
        );
      }

      await user.getIdToken(true);

      // Obtener datos completos del usuario
      const userData = await getUserByID(user.uid);

      // Guardar en contexto
      setUserData(userData);

      // Guardar en localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
    } catch (firebaseError) {
      console.error("Error al registrar usuario:", firebaseError);
      let errorMessage = "Error al registrar. Inténtalo de nuevo.";

      if (firebaseError instanceof Error && firebaseError.message) {
        errorMessage = firebaseError.message;
      } else {
        switch (firebaseError.code) {
          case "auth/email-already-in-use":
            errorMessage = "El correo electrónico ya está registrado.";
            break;
          case "auth/invalid-email":
            errorMessage = "El formato del correo electrónico es inválido.";
            break;
          case "auth/weak-password":
            errorMessage = "La contraseña debe tener al menos 6 caracteres.";
            break;
          case "auth/operation-not-allowed":
            errorMessage =
              "La autenticación con correo/contraseña no está habilitada.";
            break;
          default:
            errorMessage = `Error de Firebase: ${firebaseError.message}`;
            break;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="card lg:card-side bg-base-200 shadow-sm lg:mx-30 mx-10 w-[450px] min-w-[25%]">
        <div className="card-body items-center text-center">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
          <img src={qMatLogo} className="my-4 h-8 w-auto" alt="qMática" />
          <div role="tablist" className="card-title tabs tabs-border">
            <Link role="tab" className="tab" onClick={loginToggle}>
              Iniciar Sesión
            </Link>
            <Link role="tab" className="tab tab-active text-primary">
              Registrarse
            </Link>
          </div>
          {error && (
            <div
              role="alert"
              className="alert alert-error alert-soft min-w-[85%]"
            >
              <span className="w-full">{error}</span>
            </div>
          )}
          <form onSubmit={handleRegister} className="min-w-[85%]">
            <fieldset className="fieldset pb-8 justify-center">
              <label className="fieldset-legend">Nombre de Usuario</label>
              <input
                type="text"
                className="input w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <label className="fieldset-legend">Correo</label>
              <input
                type="email"
                className="input w-full"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <label className="fieldset-legend">Contraseña</label>
              <div className="join">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input join-item w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn join-item"
                  onClick={togglePassword}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff strokeWidth={1.5} />
                  ) : (
                    <Eye strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </fieldset>
            <div className="card-actions justify-center pb-5">
              <button
                type="submit"
                className="btn btn-primary w-full"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registrando..." : "Regístrate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
