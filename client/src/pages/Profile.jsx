import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../api';
import Toast from '../components/Toast';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '', department: user?.department || '', year: user?.year || '',
        phone: user?.phone || '', vehicleType: user?.vehicleType || 'none',
        vehicleNumber: user?.vehicleNumber || '', emergencyContact: user?.emergencyContact || '',
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data } = await updateMyProfile({ ...form, year: parseInt(form.year) });
            setUser(data);
            setEditing(false);
            setToast({ message: 'Profile updated!', type: 'success' });
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div className="page-container">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="animate-fadeInUp">
                <h1 className="page-title">👤 My Profile</h1>
                <p className="page-subtitle">Manage your personal information</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
                {/* Profile Card */}
                <div className="glass-card animate-fadeInUp" style={{ padding: 28, textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: 'white', margin: '0 auto 16px' }}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 4, color: '#e2e8f0' }}>{user?.name}</h2>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{user?.email}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="stat-card">
                            <div style={{ fontWeight: 700, fontSize: 20, color: '#6366f1' }}>{user?.rideCount || 0}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Rides</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ fontWeight: 700, fontSize: 20, color: '#f59e0b' }}>⭐ {user?.rating?.toFixed(1) || '0.0'}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Rating</div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="glass-card animate-fadeInUp" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ fontWeight: 700 }}>Personal Info</h3>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} className="btn-secondary" id="edit-profile-btn">✏️ Edit</button>
                        ) : (
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={handleSave} className="btn-primary" disabled={loading} id="save-profile-btn">
                                    {loading ? '⏳' : '💾'} Save
                                </button>
                                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="form-label">Full Name</label>
                            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!editing} />
                        </div>
                        <div>
                            <label className="form-label">Department</label>
                            <input className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} disabled={!editing} />
                        </div>
                        <div>
                            <label className="form-label">Year</label>
                            <select className="form-select" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} disabled={!editing}>
                                {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Phone</label>
                            <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!editing} />
                        </div>
                        <div>
                            <label className="form-label">Vehicle Type</label>
                            <select className="form-select" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} disabled={!editing}>
                                <option value="none">No Vehicle</option>
                                <option value="bike">Bike</option>
                                <option value="car">Car</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Vehicle Number</label>
                            <input className="form-input" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} disabled={!editing} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Emergency Contact</label>
                            <input className="form-input" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} disabled={!editing} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
