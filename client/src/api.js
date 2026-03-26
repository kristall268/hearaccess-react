const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const api = {
  // ── Auth ──
  login: (username, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(r => r.json()),

  me: () =>
    fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(r => {
      if (!r.ok) throw new Error('Unauthorized');
      return r.json();
    }),

  // ── Team (public) ──
  getTeam: () =>
    fetch(`${API_BASE}/team`).then(r => r.json()),

  getTeamMember: (id) =>
    fetch(`${API_BASE}/team/${id}`).then(r => r.json()),

  // ── Team (admin) ──
  createTeamMember: (formData) =>
    fetch(`${API_BASE}/team`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(r => r.json()),

  updateTeamMember: (id, formData) =>
    fetch(`${API_BASE}/team/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: formData,
    }).then(r => r.json()),

  deleteTeamMember: (id) =>
    fetch(`${API_BASE}/team/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(r => r.json()),

  // ── Public forms ──
  submitPartnership: (data) =>
    fetch(`${API_BASE}/forms/partnership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  submitVolunteer: (data) =>
    fetch(`${API_BASE}/forms/volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  submitContact: (data) =>
    fetch(`${API_BASE}/forms/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // ── Admin submissions ──
  getSubmissions: (tab, page = 1) =>
    fetch(`${API_BASE}/admin/submissions?tab=${tab}&page=${page}`, {
      headers: getHeaders(),
    }).then(r => r.json()),
};

export default api;
