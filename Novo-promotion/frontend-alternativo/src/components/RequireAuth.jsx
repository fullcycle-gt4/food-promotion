import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const homeFor = (user) => (user?.role === 'admin' ? '/admin/produtos' : '/');

export default function RequireAuth({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;
  return children;
}
