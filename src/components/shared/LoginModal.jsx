import { useState } from "react";
import { Link } from "react-router";

import qMatLogo from "../../assets/svg/qMatLogo.svg";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { getUserByID } from "../../helpers/apiHelpers";
import { useUser } from "../../context/UserContext";

import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseClient";

const LoginModal = ({ onClose, registerToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const { setUserData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Obtener datos desde tu backend
      const userData = await getUserByID(firebaseUser.uid);

      // Guardar en contexto
      setUserData(userData);

      // Guardar en localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      onClose(); // Cierra el modal
    } catch (firebaseError) {
      console.error("Error al iniciar sesión:", firebaseError.code);
      switch (firebaseError.code) {
        case "auth/invalid-email":
          setError("El formato del correo electrónico es inválido.");
          break;
        case "auth/user-disabled":
          setError("Este usuario ha sido deshabilitado.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Correo o contraseña incorrectos.");
          break;
        case "auth/invalid-credential":
          setError("Credenciales inválidas. Verifica tu correo y contraseña.");
          break;
        default:
          setError("Error al iniciar sesión. Inténtalo de nuevo.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const openForgotPasswordModal = (e) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
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
            <Link role="tab" className="tab tab-active text-primary">
              Iniciar Sesión
            </Link>
            <Link role="tab" className="tab" onClick={registerToggle}>
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
          <form onSubmit={handleLogin} className="min-w-[85%]">
            <fieldset className="fieldset pb-8 justify-center min-w-[85%]">
              <label className="fieldset-legend">Correo</label>
              <input
                type="email"
                value={email}
                className="input w-full"
                placeholder="ejemplo@correo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <label className="fieldset-legend">Contraseña</label>
              <div className="join">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="input join-item w-full"
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
            <div className="card-actions justify-center min-w-[85%] pb-5">
              <button
                type="submit"
                className="btn btn-primary w-full"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </button>
              <a
                href="#"
                className="font-medium pt-2"
                onClick={openForgotPasswordModal}
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={closeForgotPasswordModal} />
      )}
    </div>
  );
};

export default LoginModal;
