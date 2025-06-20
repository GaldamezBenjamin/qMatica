import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

// Middleware para rutas que requieren autenticación
export const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Middleware para rutas que requieren suscripción
export const RequireSubscription = ({ children }) => {
  const { currentUser, isSubscribed } = useAuth();

  if (!currentUser || !isSubscribed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Middleware para rutas de administrador
export const RequireAdmin = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Middleware para rutas de usuario normal (no admin)
export const RequireRegularUser = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser || isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};