// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getUserByID } from '../helpers/apiHelpers';
import { auth } from '../firebaseClient'; // Importa tu instancia de Firebase Auth

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userClaims, setUserClaims] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usa Firebase Auth para obtener la id del usuario autenticado
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        try {
          const user = await getUserByID(userId);
          setCurrentUser(user);
          setUserClaims({
            rol: user.rol,
            suscrito: user.suscripcion.suscrito
          });
        } catch {
          setCurrentUser(null);
          setUserClaims(null);
        }
      } else {
        setCurrentUser(null);
        setUserClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    isAdmin: userClaims?.rol === 'admin',
    isSubscribed: userClaims?.suscrito === true
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};