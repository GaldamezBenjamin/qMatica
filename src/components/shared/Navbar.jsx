import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

import qMatLogo from "../../assets/svg/qMatLogo.svg";
import { Menu, UserRound, Power } from "lucide-react";
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";
import { useUser } from "../../context/UserContext.jsx";

import { auth } from "../../firebaseClient.js";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userClaims, setUserClaims] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { setUserData, userData, clearUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoadingAuth(true);
        try {
          const tokenResult = await currentUser.getIdTokenResult(true);
          setUserClaims(tokenResult.claims);
        } catch (error) {
          console.error("Error al obtener custom claims:", error);
          setUserClaims(null);
        } finally {
          setLoadingAuth(false);
        }
      } else {
        setUserClaims(null);
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearUserData();
      navigate("/");
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

  // Lógica de degradado según rango para el botón de usuario
  let gradFrom = "#de9c5f";
  let gradTo = "#b87333";
  let letraColor = "#744920";
  let rangoNombre = "Bronce";
  let exp = userData?.exp?.actual || 0;
  if (exp >= 12000) {
    rangoNombre = "Oro";
    gradFrom = "#fad766";
    gradTo = "#d4af37";
    letraColor = "#9b7f29";
  } else if (exp >= 6000) {
    rangoNombre = "Plata";
    gradFrom = "#e6e6e6";
    gradTo = "#c0c0c0";
    letraColor = "#7b7b7b";
  }

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm fixed top-0 w-full z-30 flex px-4">
        {/* Logo y menú hamburguesa */}
        <div className="navbar-start w-75">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm lg:hidden mr-2"
            >
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
                <Link to="/subscripcion" className="text-primary">
                  Suscribirse
                </Link>
              </li>
              {userClaims?.rol === "admin" && (
                <li>
                  <Link to="/admin" className="text-secondary">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <Link to="/" className="shrink-0">
            <img src={qMatLogo} className="h-6 w-auto" alt="qMática" />
          </Link>
        </div>

        {/* Contenedor principal para elementos derechos */}
        <div className="navbar-end flex-1 justify-end w-80%">
          {/* Enlaces de navegación - alineados a la derecha */}
          <div className="hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1 font-semibold">
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
              {userClaims?.rol === "admin" && (
                <li>
                  <Link to="/admin" className="text-secondary">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Divider y botones de usuario - extremo derecho */}
          <div className="flex items-center">
            {(user || (!user && !loadingAuth)) && (
              <div className="hidden md:flex h-8 w-px bg-gray-300 mx-3"></div>
            )}

            <div className="flex items-center gap-2">
              {loadingAuth ? (
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <button
                    className="btn btn-ghost btn-square btn-sm"
                    onClick={handleSignOut}
                    aria-label="Cerrar sesión"
                  >
                    <Power size={20} />
                  </button>
                  <Link
                    className="btn btn-sm"
                    to="/user"
                    style={{
                      background: `linear-gradient(to bottom right, ${gradFrom}, ${gradTo})`,
                      color: letraColor,
                      border: "none",
                    }}
                  >
                    <UserRound size={18} className="mr-1" />
                    <span
                      className="hidden md:inline"
                      style={{ color: letraColor }}
                    >
                      {userData?.username || user?.displayName || "Perfil"}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={toggleLoginModal}
                  >
                    <span className="hidden md:inline">Iniciar Sesión</span>
                    <span className="md:hidden">Login</span>
                  </button>
                  <button
                    className="btn bg-qmat1 text-white btn-sm"
                    onClick={toggleRegisterModal}
                  >
                    <span className="hidden md:inline">Registrarse</span>
                    <span className="md:hidden">Registro</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modales */}
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
