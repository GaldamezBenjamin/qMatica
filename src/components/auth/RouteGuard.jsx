import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const RouteGuard = ({ children, requireAuth = false, requireAdmin = false, requireSubscription = false }) => {
  const location = useLocation();
  const { currentUser, isAdmin, isSubscribed } = useAuth();
  
  if (requireAuth && !currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (requireSubscription && !isSubscribed) {
    return <Navigate to="/subscripcion" state={{ from: location }} replace />;
  }
  
  return children;
};

export default RouteGuard;