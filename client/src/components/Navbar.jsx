import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const navItems = [
        { path: '/', label: '🏠 Dashboard', id: 'nav-dashboard' },
        { path: '/search', label: '🔍 Search', id: 'nav-search' },
        { path: '/post-ride', label: '➕ Post Ride', id: 'nav-post' },
        { path: '/my-rides', label: '🚗 My Rides', id: 'nav-rides' },
        { path: '/chat', label: '💬 Chat', id: 'nav-chat' },
        { path: '/history', label: '📋 History', id: 'nav-history' },
        { path: '/cost-split', label: '💰 Split', id: 'nav-split' },
    ];

    return (
        <nav style={{
            background: 'rgba(10, 10, 30, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24 }}>🚀</span>
                    <span className="gradient-text" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>RideBuddy</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            id={item.id}
                            style={{
                                textDecoration: 'none',
                                padding: '8px 14px',
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 500,
                                color: location.pathname === item.path ? '#818cf8' : '#94a3b8',
                                background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user.isAdmin && (
                        <Link to="/admin" id="nav-admin" style={{
                            textDecoration: 'none', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                            color: location.pathname === '/admin' ? '#818cf8' : '#f59e0b',
                            background: location.pathname === '/admin' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        }}>⚙️ Admin</Link>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link to="/profile" id="nav-profile" style={{
                        textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 12px', borderRadius: 10,
                        background: 'rgba(99, 102, 241, 0.08)',
                        color: '#e2e8f0', fontSize: 13, fontWeight: 500,
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: 'white',
                        }}>
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        {user.name?.split(' ')[0]}
                    </Link>
                    <button onClick={handleLogout} id="logout-btn" style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '6px 14px', borderRadius: 10, cursor: 'pointer',
                        fontSize: 13, fontWeight: 500,
                    }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
