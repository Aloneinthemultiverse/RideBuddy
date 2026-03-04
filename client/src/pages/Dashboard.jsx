import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchRides } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRides = async () => {
            try {
                const { data } = await searchRides({});
                setRides(data.slice(0, 6));
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        loadRides();
    }, []);

    const quickActions = [
        { icon: '🚗', label: 'Post a Ride', path: '/post-ride', color: '#6366f1' },
        { icon: '🔍', label: 'Find a Ride', path: '/search', color: '#06b6d4' },
        { icon: '📋', label: 'My Rides', path: '/my-rides', color: '#8b5cf6' },
        { icon: '💰', label: 'Cost Split', path: '/cost-split', color: '#10b981' },
    ];

    return (
        <div className="page-container">
            {/* Welcome Section */}
            <div className="animate-fadeInUp" style={{ marginBottom: 32 }}>
                <h1 className="page-title">
                    Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="page-subtitle">Find your next ride or share one with fellow students</p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
                {quickActions.map((action, i) => (
                    <Link key={i} to={action.path} style={{ textDecoration: 'none' }}>
                        <div className="glass-card glass-card-hover" style={{ padding: 24, textAlign: 'center', cursor: 'pointer', animationDelay: `${i * 0.1}s` }}>
                            <div style={{ fontSize: 36, marginBottom: 8 }}>{action.icon}</div>
                            <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 15 }}>{action.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 36 }}>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1' }}>{user?.rideCount || 0}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Rides Taken</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{user?.rating?.toFixed(1) || '0.0'}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Rating</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#06b6d4' }}>{user?.department || '—'}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Department</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>Year {user?.year || '—'}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Study Year</div>
                </div>
            </div>

            {/* Recent Rides */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>🚗 Available Rides</h2>
                <Link to="/search" style={{ color: '#818cf8', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>View All →</Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading rides...</div>
            ) : rides.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🛣️</div>
                    <p style={{ color: '#64748b', marginBottom: 16 }}>No rides available right now</p>
                    <Link to="/post-ride"><button className="btn-primary">Post the first ride!</button></Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                    {rides.map(ride => (
                        <Link key={ride._id} to={`/ride/${ride._id}`} style={{ textDecoration: 'none' }}>
                            <div className="glass-card glass-card-hover" style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <span className={`badge badge-${ride.vehicleType}`}>{ride.vehicleType === 'car' ? '🚗 Car' : '🏍️ Bike'}</span>
                                    <span className="badge badge-active">{ride.seatsAvailable} seats left</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ color: '#10b981' }}>📍</span>
                                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.source}</span>
                                    <span style={{ color: '#64748b' }}>→</span>
                                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.destination}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 13 }}>
                                    <span>📅 {ride.date}</span>
                                    <span>🕐 {ride.time}</span>
                                    {ride.costPerSeat > 0 && <span>💰 ₹{ride.costPerSeat}/seat</span>}
                                </div>
                                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>
                                        {ride.driver?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{ride.driver?.name} • {ride.driver?.department}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
