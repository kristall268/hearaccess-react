import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminTopbar from '../components/AdminTopbar';
import Pagination from '../components/Pagination';
import api from '../api';

const PAGE_SIZE = 10;
const TABS = [
  { key: 'partnerships', label: 'Partnerships', emptyIcon: '🤝', emptyText: 'No partnership requests yet.' },
  { key: 'volunteers', label: 'Volunteers', emptyIcon: '🙋', emptyText: 'No volunteer applications yet.' },
  { key: 'contacts', label: 'Contact Messages', emptyIcon: '✉️', emptyText: 'No contact messages yet.' },
];

export default function AdminSubmissions() {
  const [tab, setTab] = useState('partnerships');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ partnerships: 0, volunteers: 0, contacts: 0 });

  const load = useCallback(async () => {
    try {
      const res = await api.getSubmissions(tab, page);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
      if (res.counts) setCounts(res.counts);
    } catch { /* ignore */ }
  }, [tab, page]);

  useEffect(() => { load(); }, [load]);

  const switchTab = (key) => { setTab(key); setPage(1); };

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const formatTime = (d) => {
    const dt = new Date(d);
    return dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
  };

  return (
    <div className="admin-wrap">
      <AdminTopbar />
      <div className="admin-body" style={{ maxWidth: 1200 }}>
        <div className="admin-page-header">
          <div className="admin-page-title">Submissions <em>&amp; Applications</em></div>
          <Link to="/admin" className="admin-nav-link">← Team Members</Link>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`tab-btn${tab === t.key ? ' active' : ''}`}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
              <span className="tab-count">{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {data.length === 0 ? (
          <div className="admin-empty" style={{ background: 'var(--white)', boxShadow: '0 2px 12px rgba(59,19,71,0.06)', padding: '64px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.4 }}>
              {TABS.find(t => t.key === tab)?.emptyIcon}
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              {TABS.find(t => t.key === tab)?.emptyText}
            </div>
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {tab === 'partnerships' && <th>Organization</th>}
                  {tab === 'volunteers' && <th>Role</th>}
                  {tab === 'contacts' && <th>Subject</th>}
                  <th>Message</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <td className="td-name">{r.full_name}</td>
                    <td className="td-email"><a href={`mailto:${r.email}`}>{r.email}</a></td>
                    {tab === 'partnerships' && <td className="td-org">{r.organization}</td>}
                    {tab === 'volunteers' && <td><span className="role-badge">{r.role}</span></td>}
                    {tab === 'contacts' && <td className="td-org">{r.subject}</td>}
                    <td><div className="td-message">{r.message}</div></td>
                    <td className="td-date">
                      {formatDate(r.submitted_at)}
                      <br /><span style={{ opacity: 0.6 }}>{formatTime(r.submitted_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
