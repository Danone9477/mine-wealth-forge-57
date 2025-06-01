
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const { user } = useAuth();

  // Verificar se o usuário está logado (em um app real, verificaria se é admin)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AdminDashboard />;
};

export default Admin;
