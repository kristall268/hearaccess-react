import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminTopbar from '../components/AdminTopbar';
import { PersonIcon } from '../components/Icons';
import api from '../api';

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [toast, setToast] = useState('');

  const load = () => api.getTeam().then(setMembers).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete ${m.member_name}?`)) return;
    try {
      await api.deleteTeamMember(m.id);
      setToast(`'${m.member_name}' has been deleted.`);
      load();
      setTimeout(() => setToast(''), 4000);
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="admin-wrap">
      <AdminTopbar />
      <div className="admin-body">
        <div className="admin-page-header">
          <div className="admin-page-title">Team <em>Members</em></div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/admin/submissions" className="btn-add btn-add-secondary">View Submissions</Link>
            <Link to="/admin/create" className="btn-add">+ Add Member</Link>
          </div>
        </div>

        {toast && <div className="admin-toast">✓ {toast}</div>}

        {members.length === 0 ? (
          <div className="admin-empty">No team members yet. Add the first one!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td>
                    {m.photo_url ? (
                      <img className="admin-member-photo" src={m.photo_url} alt={m.member_name} />
                    ) : (
                      <div className="admin-photo-placeholder"><PersonIcon size={20} strokeWidth={1.5} /></div>
                    )}
                  </td>
                  <td className="td-name">{m.member_name}</td>
                  <td className="td-role">{m.member_role}</td>
                  <td className="td-bio">{m.member_bio}</td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/edit/${m.id}`} className="btn-edit">Edit</Link>
                      <button className="btn-delete" onClick={() => handleDelete(m)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
