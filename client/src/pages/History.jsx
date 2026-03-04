import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRides, getMyRequests } from '../api';

const History = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [ridesRes, reqsRes] = await Promise.all([getMyRides(), getMyRequests()]);
                const completedPosted = ridesRes.data.filter(r => r.status === 'completed');
                const completedRequests = reqsRes.data
                    .filter(r => r.status === 'accepted' && r.ride?.status === 'completed')
                    .map(r => ({ ...r.ride, _asPassenger: true, _requestStatus: r.status }));

                const allRides = [...completedPosted, ...completedRequests];
                allRides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRides(allRides);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="page-container">
            <div className="animate-fadeInUp">
                <h1 className="page-title">📋 Ride History</h1>
                <p className="page-subtitle">Your past completed rides</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
            ) : rides.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                    <p style={{ color: '#64748b' }}>No completed rides yet</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {rides.map((ride, i) => (
                        <div key={ride._id + '-' + i} className="glass-card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.source}</span>
                                    <span style={{ color: '#64748b' }}>→</span>
                                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.destination}</span>
                                </div>
                                <div style={{ fontSize: 13, color: '#94a3b8' }}>
                                    📅 {ride.date} • 🕐 {ride.time}
                                    {ride.costPerSeat > 0 && ` • 💰 ₹${ride.costPerSeat}`}
                                </div>
                                {ride.driver && (
                                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                                        Driver: {ride.driver?.name || 'You'}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="badge badge-completed">✅ Completed</span>
                                {ride._asPassenger && ride.driver?._id && (
                                    <Link to={`/reviews/${ride.driver._id}`} style={{ color: '#818cf8', fontSize: 12, textDecoration: 'none' }}>
                                        Leave Review →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
