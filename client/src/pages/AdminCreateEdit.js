import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminTopbar from '../components/AdminTopbar';
import { PersonIcon, UploadIcon } from '../components/Icons';
import api from '../api';

export default function AdminCreateEdit() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    api.getTeamMember(id).then(m => {
      if (m.error) { navigate('/admin'); return; }
      setName(m.member_name);
      setRole(m.member_role);
      setBio(m.member_bio || '');
      setExistingPhoto(m.photo_url);
    });
  }, [id, isEdit, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File is too large. Maximum size is 5 MB.'); return; }
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPreview(null);
    setExistingPhoto(null);
    setRemovePhoto(true);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!role.trim()) errs.role = 'Role is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('member_name', name);
      fd.append('member_role', role);
      fd.append('member_bio', bio);
      if (photoFile) fd.append('photo', photoFile);
      if (removePhoto) fd.append('remove_photo', 'true');

      if (isEdit) {
        await api.updateTeamMember(id, fd);
      } else {
        await api.createTeamMember(fd);
      }
      navigate('/admin');
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const photoSrc = preview || existingPhoto || null;
  const hasPhoto = Boolean(photoSrc);

  return (
    <div className="admin-form-wrap">
      <AdminTopbar />
      <div className="admin-form-body">
        <div className="admin-form-header">
          <div className="admin-breadcrumb">
            <Link to="/admin">Team Members</Link> &nbsp;/&nbsp; {isEdit ? 'Edit' : 'Add New'}
          </div>
          <div className="admin-form-title">
            {isEdit ? 'Edit' : 'Add'} <em>Member</em>
          </div>
        </div>

        <div className="admin-card">
          <form onSubmit={handleSubmit}>
            <div className="af-field">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Aisha Seitkali" value={name} onChange={e => setName(e.target.value)} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="af-field">
              <label>Role</label>
              <input type="text" placeholder="e.g. Founder · Educator" value={role} onChange={e => setRole(e.target.value)} />
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            <div className="af-field">
              <label>Bio</label>
              <textarea rows="4" placeholder="Short bio about this team member's role and passion for the mission." value={bio} onChange={e => setBio(e.target.value)} />
            </div>

            <div className="af-field">
              <label>
                Photo <span style={{ opacity: 0.5, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>(optional — JPG, PNG, WebP, max 5 MB)</span>
              </label>
              <div className="af-photo-area">
                <div className="af-photo-thumb">
                  {hasPhoto ? (
                    <img src={photoSrc} alt="Photo" />
                  ) : (
                    <PersonIcon size={36} strokeWidth={1} />
                  )}
                </div>
                <div className="af-upload-controls">
                  <label className="af-upload-btn" htmlFor="photoFile">
                    <UploadIcon /> Upload photo
                  </label>
                  <input
                    ref={fileRef}
                    type="file" id="photoFile"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <span className="af-hint">
                    {photoFile ? photoFile.name : (existingPhoto ? 'Current file saved' : 'No file chosen')}
                  </span>
                  {hasPhoto && (
                    <button type="button" className="af-remove-btn" onClick={handleRemovePhoto}>
                      ✕ Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="af-actions">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
              </button>
              <Link to="/admin" className="btn-cancel">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
