import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Signup = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', department: '', year: '', phone: '',
        vehicleType: 'none', vehicleNumber: '', emergencyContact: '',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await signup({ ...form, year: parseInt(form.year) });
            loginUser(data.token, data.user);
            navigate('/');
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Signup failed', type: 'error' });
        }
        setLoading(false);
    };

    const update = (field, value) => setForm({ ...form, [field]: value });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div className="bg-blob" style={{ width: 400, height: 400, background: '#6366f1', top: -100, right: -100 }} />
            <div className="bg-blob" style={{ width: 300, height: 300, background: '#8b5cf6', bottom: -50, left: -50 }} />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="glass-card animate-fadeInUp" style={{ width: '100%', maxWidth: 520, padding: 40, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
                    <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Join RideBuddy</h1>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Create your campus ride-sharing account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                            <label className="form-label">Full Name *</label>
                            <input id="signup-name" className="form-input" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                        </div>
                        <div>
                            <label className="form-label">Email *</label>
                            <input id="signup-email" type="email" className="form-input" placeholder="you@college.edu" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label className="form-label">Password *</label>
                        <input id="signup-password" type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={6} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                            <label className="form-label">Department *</label>
                            <input id="signup-dept" className="form-input" placeholder="Computer Science" value={form.department} onChange={(e) => update('department', e.target.value)} required />
                        </div>
                        <div>
                            <label className="form-label">Year *</label>
                            <select id="signup-year" className="form-select" value={form.year} onChange={(e) => update('year', e.target.value)} required>
                                <option value="">Select</option>
                                {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label className="form-label">Phone Number *</label>
                        <input id="signup-phone" className="form-input" placeholder="9876543210" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                            <label className="form-label">Vehicle Type</label>
                            <select id="signup-vehicle" className="form-select" value={form.vehicleType} onChange={(e) => update('vehicleType', e.target.value)}>
                                <option value="none">No Vehicle</option>
                                <option value="bike">Bike</option>
                                <option value="car">Car</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Vehicle Number</label>
                            <input id="signup-vehicle-num" className="form-input" placeholder="KA01AB1234" value={form.vehicleNumber} onChange={(e) => update('vehicleNumber', e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label">Emergency Contact</label>
                        <input id="signup-emergency" className="form-input" placeholder="Emergency phone number" value={form.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} />
                    </div>

                    <button type="submit" id="signup-submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 15 }}>
                        {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: 14 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
