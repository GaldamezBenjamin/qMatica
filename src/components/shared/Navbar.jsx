import React, { useState, useEffect } from 'react';
import main2 from '../../assets/images/main2.png';
import qMatLogo from '../../assets/svg/qMatLogo.svg';
import { auth } from '../../firebaseClient.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const [isRegisterPopoutVisible, setIsRegisterPopoutVisible] = useState(false);
  const [isLoginPopoutVisible, setIsLoginPopoutVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const toggleRegisterPopout = () => {
    setIsRegisterPopoutVisible(!isRegisterPopoutVisible);
    setIsLoginPopoutVisible(false);
  };

  const toggleLoginPopout = () => {
    setIsLoginPopoutVisible(!isLoginPopoutVisible);
    setIsRegisterPopoutVisible(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Usuario cerró sesión');
      // El estado 'user' se actualizará automáticamente a null gracias a onAuthStateChanged
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white py-4 px-6 flex items-center justify-between border-b-[1px] border-[#ececec]">
      <img src={qMatLogo} className='max-h-7'></img>
      <nav className="space-x-8 flex items-center text-stone-950">
        <a href="/quizzes" className="font-medium hover:text-stone-500">
          Quizzes
        </a>
        <a href="/temarios" className="font-medium hover:text-stone-500">
          Temarios
        </a>
        <a href="/foros" className="font-medium hover:text-stone-500">
          Foros
        </a>
        <div className="flex items-center space-x-4">
          <a
            href="/suscribirse"
            className="font-medium bg-gradient-to-r from-[#f0596c] to-[#824894] text-transparent bg-clip-text"
          >
            Suscribirse
          </a>
          <span className="font-extralight text-[#ececec] text-3xl">|</span>
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="font-medium hover:text-stone-500 focus:outline-none flex items-center"
              >
                {user.displayName || user.email}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                  <a
                    href="/perfil"
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Perfil
                  </a>
                  <a
                    href="/estadisticas"
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Estadísticas
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={toggleLoginPopout} className="font-medium hover:text-stone-500 focus:outline-none">
                Iniciar Sesión
              </button>
              <button onClick={toggleRegisterPopout} className="bg-[#f0596c] text-white font-semibold py-2 px-4 rounded hover:bg-[#ff7184] focus:outline-none">
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      <LoginPopout
        isVisible={isLoginPopoutVisible}
        onClose={toggleLoginPopout}
        onRegisterClick={toggleRegisterPopout}
      />

      <RegisterPopout
        isVisible={isRegisterPopoutVisible}
        onClose={toggleRegisterPopout}
        onLoginClick={toggleLoginPopout}
      />
    </header>
  );
};

export default Navbar;

const LoginPopout = ({ isVisible, onClose, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado');
      onClose();
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setError(error.message);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/75 z-40 flex items-center justify-center">
      <div className="bg-gray-100 overflow-hidden rounded-lg shadow-xl z-50 max-w-2/3 w-full max-h-2/3 h-full md:flex">
        <div className="md:w-1/2 relative">
          <img src={main2} alt="Iniciar Sesión Popout" className="w-full h-full object-cover" /> {/* Usa la imagen importada */}
        </div>
        <div className="md:w-1/2 px-12 relative flex flex-col justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-2 rounded-full focus:outline-none focus:shadow-outline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-stone-950 mb-6">
            Iniciar Sesión
          </h2>
          <div>
            <label htmlFor="login-email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="login-email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="login-password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="login-password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            className="mt-8 bg-[#f0596c] hover:bg-[#ff7184] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>
          <p className="mt-6 text-center text-gray-600 text-sm">
            ¿No tienes una cuenta? <button onClick={onRegisterClick} className="text-[#f0596c] hover:underline focus:outline-none">Regístrate</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterPopout = ({ isVisible, onClose, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      // Llamada al backend para guardar datos adicionales del usuario
      await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid, // UID generado por Firebase Auth
          username: username,
          email: email,
          rol: 'usuario', // Rol por defecto al registrarse
          // Otros campos iniciales si es necesario
        }),
      });

      // Llamada al backend para crear estadísticas iniciales del usuario
      await fetch('/api/estadisticas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
        }),
      });

      console.log('Usuario registrado:', user);
      onClose();
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      setError(error.message);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/75 z-40 flex items-center justify-center">
      <div className="bg-gray-100 overflow-hidden rounded-lg shadow-xl z-50 max-w-2/3 w-full max-h-2/3 h-full md:flex">
        <div className="md:w-1/2 relative">
          <img src={main2} alt="Únete a qMática" className="w-full h-full object-cover" /> {/* Usa la imagen importada */}
        </div>
        <div className="md:w-1/2 px-12 relative flex flex-col justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-2 rounded-full focus:outline-none focus:shadow-outline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-stone-950 mb-6">
            Únete a qMática
          </h2>
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="register-email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="register-email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="register-password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="register-password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            className="mt-8 bg-[#f0596c] hover:bg-[#ff7184] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleRegister}
          >
            Registrarse
          </button>
          <p className="mt-6 text-center text-gray-600 text-sm">
            ¿No recuerdas tu contraseña? <button onClick={onLoginClick} className="text-[#f0596c] hover:underline focus:outline-none">Restablece tu contraseña</button>
          </p>
        </div>
      </div>
    </div>
  );
};