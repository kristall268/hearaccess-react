import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminTopbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-topbar">
      <Link to="/admin" className="admin-topbar-logo">Her<span>Access</span></Link>
      <div className="admin-topbar-right">
        <span className="admin-topbar-label">Admin Panel</span>
        <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  );
}
