import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(form);
            loginUser(data.token, data.user);
            navigate('/');
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Login failed', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background blobs */}
            <div className="bg-blob" style={{ width: 400, height: 400, background: '#6366f1', top: -100, left: -100 }} />
            <div className="bg-blob" style={{ width: 300, height: 300, background: '#06b6d4', bottom: -50, right: -50 }} />
            <div className="bg-blob" style={{ width: 200, height: 200, background: '#8b5cf6', top: '50%', left: '60%' }} />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="glass-card animate-fadeInUp" style={{ width: '100%', maxWidth: 440, padding: 40, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
                    <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>RideBuddy</h1>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Share rides. Save money. Go green.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label className="form-label">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            className="form-input"
                            placeholder="your@college.edu"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label className="form-label">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        id="login-submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 15 }}
                    >
                        {loading ? '⏳ Signing in...' : '🔐 Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 14 }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
