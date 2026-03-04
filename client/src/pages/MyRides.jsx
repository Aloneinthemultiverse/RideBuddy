import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRides, getMyRequests } from '../api';

const MyRides = () => {
    const [tab, setTab] = useState('posted');
    const [rides, setRides] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [ridesRes, reqsRes] = await Promise.all([getMyRides(), getMyRequests()]);
                setRides(ridesRes.data);
                setRequests(reqsRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="page-container">
            <div className="animate-fadeInUp">
                <h1 className="page-title">🚗 My Rides</h1>
                <p className="page-subtitle">Manage your posted rides and seat requests</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button
                    onClick={() => setTab('posted')}
                    className={tab === 'posted' ? 'btn-primary' : 'btn-secondary'}
                    id="tab-posted"
                >
                    🚗 My Posted Rides ({rides.length})
                </button>
                <button
                    onClick={() => setTab('requests')}
                    className={tab === 'requests' ? 'btn-primary' : 'btn-secondary'}
                    id="tab-requests"
                >
                    🙋 My Requests ({requests.length})
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
            ) : tab === 'posted' ? (
                rides.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
                        <p style={{ color: '#64748b', marginBottom: 16 }}>You haven't posted any rides yet</p>
                        <Link to="/post-ride"><button className="btn-primary">Post Your First Ride</button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {rides.map(ride => (
                            <Link key={ride._id} to={`/ride/${ride._id}`} style={{ textDecoration: 'none' }}>
                                <div className="glass-card glass-card-hover" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.source}</span>
                                            <span style={{ color: '#64748b' }}>→</span>
                                            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.destination}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, color: '#94a3b8', fontSize: 13 }}>
                                            <span>📅 {ride.date}</span>
                                            <span>🕐 {ride.time}</span>
                                            <span>💺 {ride.seatsAvailable}/{ride.seatsTotal}</span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${ride.status}`}>{ride.status}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            ) : (
                requests.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🙋</div>
                        <p style={{ color: '#64748b', marginBottom: 16 }}>You haven't requested any rides yet</p>
                        <Link to="/search"><button className="btn-primary">Find a Ride</button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {requests.map(req => (
                            <div key={req._id} className="glass-card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    {req.ride ? (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{req.ride.source}</span>
                                                <span style={{ color: '#64748b' }}>→</span>
                                                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{req.ride.destination}</span>
                                            </div>
                                            <div style={{ fontSize: 13, color: '#94a3b8' }}>
                                                By {req.ride.driver?.name} • {req.ride.date} • {req.seatsRequested} seat(s)
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ color: '#64748b' }}>Ride details unavailable</div>
                                    )}
                                </div>
                                <span className={`badge badge-${req.status}`}>{req.status}</span>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default MyRides;
