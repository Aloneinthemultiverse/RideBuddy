import { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, toggleBlockUser, getReports, resolveReport } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Admin = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, usersRes, reportsRes] = await Promise.all([getAdminStats(), getAdminUsers(), getReports()]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setReports(reportsRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, []);

    const handleBlock = async (id) => {
        try {
            const { data } = await toggleBlockUser(id);
            setToast({ message: data.message, type: 'success' });
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (err) {
            setToast({ message: 'Failed', type: 'error' });
        }
    };

    const handleResolve = async (id) => {
        try {
            await resolveReport(id, { status: 'resolved', adminNote: 'Reviewed by admin' });
            setToast({ message: 'Report resolved', type: 'success' });
            setReports(reports.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
        } catch (err) {
            setToast({ message: 'Failed', type: 'error' });
        }
    };

    if (!user?.isAdmin) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
                <p style={{ color: '#64748b' }}>Admin privileges required</p>
            </div>
        );
    }

    if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;

    return (
        <div className="page-container">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="animate-fadeInUp">
                <h1 className="page-title">⚙️ Admin Panel</h1>
                <p className="page-subtitle">Platform monitoring and management</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['stats', 'users', 'reports'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary' : 'btn-secondary'}>
                        {t === 'stats' ? '📊 Dashboard' : t === 'users' ? '👥 Users' : '🚩 Reports'}
                    </button>
                ))}
            </div>

            {/* Stats Tab */}
            {tab === 'stats' && stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#6366f1' }}>{stats.totalUsers}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Total Users</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#06b6d4' }}>{stats.totalRides}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Total Rides</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981' }}>{stats.activeRides}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Active Rides</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#8b5cf6' }}>{stats.completedRides}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Completed</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b' }}>{stats.totalRequests}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Seat Requests</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: '#ef4444' }}>{stats.pendingReports}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Pending Reports</div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.15)' }}>
                                {['Name', 'Email', 'Department', 'Year', 'Rating', 'Status', 'Action'].map(h => (
                                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.08)' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#e2e8f0' }}>{u.name}</td>
                                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{u.email}</td>
                                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{u.department}</td>
                                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{u.year}</td>
                                    <td style={{ padding: '12px 16px', color: '#f59e0b', fontSize: 13 }}>⭐ {u.rating?.toFixed(1)}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span className={`badge ${u.isBlocked ? 'badge-cancelled' : 'badge-active'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {!u.isAdmin && (
                                            <button onClick={() => handleBlock(u._id)} className={u.isBlocked ? 'btn-success' : 'btn-danger'} style={{ padding: '6px 12px', fontSize: 12 }}>
                                                {u.isBlocked ? '✅ Unblock' : '🚫 Block'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reports Tab */}
            {tab === 'reports' && (
                reports.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                        <p style={{ color: '#64748b' }}>No reports to review</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {reports.map(report => (
                            <div key={report._id} className="glass-card" style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                                            {report.reporter?.name} reported {report.reportedUser?.name}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                                            Reason: {report.reason}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span className={`badge badge-${report.status === 'pending' ? 'pending' : report.status === 'resolved' ? 'completed' : 'active'}`}>{report.status}</span>
                                        {report.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleResolve(report._id)} className="btn-success" style={{ padding: '6px 12px', fontSize: 12 }}>✅ Resolve</button>
                                                <button onClick={() => handleBlock(report.reportedUser?._id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>🚫 Block User</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Admin;
