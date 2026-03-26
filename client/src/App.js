import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateEdit from './pages/AdminCreateEdit';
import AdminSubmissions from './pages/AdminSubmissions';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="admin-wrap"><div className="admin-body">Loading...</div></div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/create" element={<ProtectedRoute><AdminCreateEdit /></ProtectedRoute>} />
      <Route path="/admin/edit/:id" element={<ProtectedRoute><AdminCreateEdit /></ProtectedRoute>} />
      <Route path="/admin/submissions" element={<ProtectedRoute><AdminSubmissions /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
