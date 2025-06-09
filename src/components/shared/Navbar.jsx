import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { useNavigate } from 'react-router';

import qMatLogo from "../../assets/svg/qMatLogo.svg";
import { Menu, Eye, EyeOff, UserRound, Power } from "lucide-react";

import { auth } from "../../firebaseClient.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userClaims, setUserClaims] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult  = await currentUser.getIdTokenResult(true);
          setUserClaims(tokenResult.claims);
        } catch (error) {
          console.error("Error al obtener custom claims:", error);
         setUserClaims(null);
        }
      } else {
        setUserClaims(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe;
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    setShowRegisterModal(false);
  };

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
    setShowLoginModal(false);
  };

  useEffect(() => {
    if (showLoginModal || showRegisterModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginModal, showRegisterModal]);

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm fixed top-0 w-full z-30">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <Menu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow font-semibold"
            >
              <li>
                <Link to="/quizzes">Quizzes</Link>
              </li>
              <li>
                <Link to="/foros">Foros</Link>
              </li>
              <li>
                <Link to="/subscripcion" className="text-qmat1">
                  Suscribirse
                </Link>
              </li>
              {userClaims?.rol === 'admin' && (
                <li>
                  <Link to="/admin" className="text-qmat1">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <Link to="/">
            <img src={qMatLogo} className="px-4 h-6 w-auto" alt="qMática"/>
          </Link>
        </div>
        <div className="navbar-end font-semibold">
          <ul className="menu menu-horizontal px-1 hidden lg:flex">
            <li>
              <Link to="/quizzes">Quizzes</Link>
            </li>
            <li>
              <Link to="/foros">Foros</Link>
            </li>
            <li>
              <Link to="/subscripcion" className="text-qmat1">
                Suscribirse
              </Link>
            </li>
            {userClaims?.rol === 'admin' && (
              <li>
                <Link to="/admin" className="text-secondary">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          <span className="font-extralight text-[#ececec] text-3xl hidden lg:flex">
            |
          </span>
          {loadingAuth ? (
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
          ) : user ? (
            <>
              <Link
                className="btn btn-ghost mx-1 xl:btn-md btn-sm"
                onClick={handleSignOut}
              >
                <Power />
              </Link>
              <Link className="btn btn-primary xl:btn-md btn-sm" to="/user">
                <UserRound /> {userClaims?.username}
              </Link>
            </>
          ) : (
            <ul>
              <Link
                className="btn btn-ghost mx-1 xl:btn-md btn-sm"
                onClick={toggleLoginModal}
              >
                Iniciar Sesión
              </Link>
              <Link
                className="btn bg-qmat1 text-white xl:btn-md btn-sm"
                onClick={toggleRegisterModal}
              >
                Registrarse
              </Link>
            </ul>
          )}
        </div>
        {showLoginModal && (
          <LoginModal
            onClose={toggleLoginModal}
            registerToggle={toggleRegisterModal}
          />
        )}
        {showRegisterModal && (
          <RegisterModal
            onClose={toggleRegisterModal}
            loginToggle={toggleLoginModal}
          />
        )}
      </div>
    </>
  );
};

export default Navbar;

const LoginModal = ({ onClose, registerToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(""); // Limpia cualquier error anterior

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Si el inicio de sesión es exitoso, puedes cerrar el modal o redirigir
      onClose();
    } catch (firebaseError) {
      // Manejo de errores de Firebase
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
        case "auth/invalid-credential": // Para versiones más recientes de Firebase
          setError("Credenciales inválidas. Verifica tu correo y contraseña.");
          break;
        default:
          setError("Error al iniciar sesión. Inténtalo de nuevo.");
          break;
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="card lg:card-side bg-base-200 shadow-sm lg:mx-30 mx-10 w-[450px] min-w-[25%]">
        <div className="card-body items-center text-center">
          <button
            className="btn btn-sm btn-ghost absolute right-2 top-2"
            onClick={onClose}
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
              <label className="fieldset-legend">
                Correo
              </label>
              <input
                type="email"
                value={email}
                className="input w-full"
                placeholder="ejemplo@correo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="fieldset-legend">
                Contraseña
              </label>
              <div className="join">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="input join-item w-full"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="btn join-item" onClick={togglePassword}>
                  {showPassword ? (
                    <EyeOff strokeWidth={1.5} />
                  ) : (
                    <Eye strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </fieldset>
            <div className="card-actions justify-center min-w-[85%] pb-5">
              <button type="submit" className="btn btn-primary w-full" onClick={handleLogin}>
                Iniciar Sesión
              </button>
              <Link to="/" className="font-medium pt-2">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RegisterModal = ({ onClose, loginToggle }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    setError(""); // Limpia cualquier error anterior
    setLoading(true); // Habilita el estado de carga

    if (!username || !email || !password) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      // 1. Registrar usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 3. Obtener el token de ID para autenticar las llamadas al backend
      const idToken = await user.getIdToken();

      // 4. Llamada al backend para guardar datos adicionales del usuario (en Firestore)
      await fetch("/api/usuarios/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Envía el token para autenticar la API
        },
        body: JSON.stringify({
          username: username,
          email: email,
          rol: "usuario",
        }),
      });

      // 5. Llamada al backend para crear estadísticas iniciales del usuario
      await fetch("/api/estadisticas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Envía el token para autenticar la API
        },
        body: JSON.stringify({
          quizzes_completados: 0,
          tiempo_promedio: 0,
          respuestas_por_categoria: [],
        }),
      });

      console.log("Usuario registrado y perfil creado:", user);
      onClose(); // Cierra el modal después de un registro exitoso
    } catch (firebaseError) {
      console.error("Error al registrar usuario:", firebaseError);
      let errorMessage = "Error al registrar. Inténtalo de nuevo.";

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
            "La autenticación con correo/contraseña no está habilitada. Contacta al soporte.";
          break;
        default:
          errorMessage = `Error de Firebase: ${firebaseError.message}`;
          break;
      }

      // Si el error es de una llamada al backend, intenta parsear el mensaje
      if (
        firebaseError.name === "TypeError" ||
        firebaseError.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Error de conexión con el servidor. Por favor, inténtalo más tarde.";
      } else if (firebaseError.response && firebaseError.response.json) {
        // Asumiendo que el error del backend viene en formato JSON
        const backendError = await firebaseError.response.json();
        errorMessage = backendError.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false); // Deshabilita el estado de carga
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="card lg:card-side bg-base-200 shadow-sm lg:mx-30 mx-10 w-[450px] min-w-[25%]">
        <div className="card-body items-center text-center">
          <button
            className="btn btn-sm btn-ghost absolute right-2 top-2"
            onClick={onClose}
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
              />
              <label className="fieldset-legend">Correo</label>
              <input
                type="email"
                className="input w-full"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="fieldset-legend">Contraseña</label>
              <div className="join">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input join-item w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn join-item"
                  onClick={togglePassword}
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
                Regístrate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
