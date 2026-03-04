import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRideById, createRequest, getRequestsForRide, updateRequest, cancelRide, completeRide } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const RideDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ride, setRide] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const isDriver = ride?.driver?._id === user?._id;

    const loadRide = async () => {
        try {
            const { data } = await getRideById(id);
            setRide(data);
            if (data.driver._id === user._id) {
                const { data: reqs } = await getRequestsForRide(id);
                setRequests(reqs);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { loadRide(); }, [id]);

    const handleRequestSeat = async () => {
        try {
            await createRequest({ rideId: id, seatsRequested: 1 });
            setToast({ message: 'Seat requested!', type: 'success' });
            loadRide();
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
        }
    };

    const handleUpdateRequest = async (reqId, status) => {
        try {
            const { data } = await updateRequest(reqId, { status });
            setToast({ message: `Request ${status}!`, type: 'success' });
            loadRide();
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
        }
    };

    const handleCancel = async () => {
        try {
            await cancelRide(id);
            setToast({ message: 'Ride cancelled', type: 'success' });
            setTimeout(() => navigate('/my-rides'), 1000);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
        }
    };

    const handleComplete = async () => {
        try {
            await completeRide(id);
            setToast({ message: 'Ride completed!', type: 'success' });
            loadRide();
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
        }
    };

    if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;
    if (!ride) return <div className="page-container" style={{ textAlign: 'center', padding: 40 }}>Ride not found</div>;

    return (
        <div className="page-container">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="animate-fadeInUp" style={{ marginBottom: 24 }}>
                <Link to="/search" style={{ color: '#818cf8', textDecoration: 'none', fontSize: 14 }}>← Back to Search</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Main Info */}
                <div>
                    <div className="glass-card animate-fadeInUp" style={{ padding: 28, marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <span className={`badge badge-${ride.vehicleType}`} style={{ fontSize: 13 }}>{ride.vehicleType === 'car' ? '🚗 Car' : '🏍️ Bike'}</span>
                            <span className={`badge badge-${ride.status}`}>{ride.status}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', margin: '0 auto 4px' }} />
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#e2e8f0' }}>{ride.source}</div>
                            </div>
                            <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #10b981, #6366f1)', borderRadius: 1 }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', margin: '0 auto 4px' }} />
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#e2e8f0' }}>{ride.destination}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
                            <div className="stat-card">
                                <div style={{ fontSize: 12, color: '#64748b' }}>Date</div>
                                <div style={{ fontWeight: 600, color: '#e2e8f0' }}>📅 {ride.date}</div>
                            </div>
                            <div className="stat-card">
                                <div style={{ fontSize: 12, color: '#64748b' }}>Time</div>
                                <div style={{ fontWeight: 600, color: '#e2e8f0' }}>🕐 {ride.time}</div>
                            </div>
                            <div className="stat-card">
                                <div style={{ fontSize: 12, color: '#64748b' }}>Seats Left</div>
                                <div style={{ fontWeight: 700, fontSize: 20, color: ride.seatsAvailable > 0 ? '#10b981' : '#ef4444' }}>
                                    {ride.seatsAvailable} / {ride.seatsTotal}
                                </div>
                            </div>
                            <div className="stat-card">
                                <div style={{ fontSize: 12, color: '#64748b' }}>Cost / Seat</div>
                                <div style={{ fontWeight: 600, color: '#f59e0b' }}>💰 ₹{ride.costPerSeat || 0}</div>
                            </div>
                        </div>

                        {ride.routeDescription && (
                            <div style={{ marginTop: 16, padding: 12, background: 'rgba(99, 102, 241, 0.05)', borderRadius: 10, fontSize: 14, color: '#94a3b8' }}>
                                📝 {ride.routeDescription}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    {ride.status === 'active' && (
                        <div className="glass-card" style={{ padding: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {!isDriver && ride.seatsAvailable > 0 && (
                                <button onClick={handleRequestSeat} id="request-seat-btn" className="btn-primary">🙋 Request a Seat</button>
                            )}
                            {!isDriver && (
                                <Link to={`/chat/${ride._id}/${ride.driver._id}`}>
                                    <button className="btn-secondary">💬 Chat with Driver</button>
                                </Link>
                            )}
                            {isDriver && (
                                <>
                                    <button onClick={handleComplete} className="btn-success">✅ Mark Complete</button>
                                    <button onClick={handleCancel} className="btn-danger">❌ Cancel Ride</button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Requests (Driver view) */}
                    {isDriver && requests.length > 0 && (
                        <div className="glass-card" style={{ padding: 20, marginTop: 20 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 Seat Requests ({requests.length})</h3>
                            {requests.map(req => (
                                <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{req.passenger?.name}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{req.passenger?.department} • Year {req.passenger?.year} • {req.seatsRequested} seat(s)</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span className={`badge badge-${req.status}`}>{req.status}</span>
                                        {req.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleUpdateRequest(req._id, 'accepted')} className="btn-success" style={{ padding: '6px 12px', fontSize: 12 }}>✅ Accept</button>
                                                <button onClick={() => handleUpdateRequest(req._id, 'rejected')} className="btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>❌ Reject</button>
                                            </>
                                        )}
                                        {req.status === 'accepted' && (
                                            <Link to={`/chat/${ride._id}/${req.passenger._id}`}>
                                                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>💬 Chat</button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar - Driver Info */}
                <div>
                    <div className="glass-card animate-fadeInUp" style={{ padding: 24, textAlign: 'center' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', margin: '0 auto 12px' }}>
                            {ride.driver?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 18, color: '#e2e8f0' }}>{ride.driver?.name}</h3>
                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{ride.driver?.department} • Year {ride.driver?.year}</p>
                        {ride.driver?.rating > 0 && (
                            <div style={{ color: '#f59e0b', fontWeight: 600 }}>⭐ {ride.driver.rating.toFixed(1)} rating</div>
                        )}
                        <div style={{ marginTop: 16 }}>
                            <Link to={`/reviews/${ride.driver._id}`} style={{ color: '#818cf8', fontSize: 13, textDecoration: 'none' }}>View Reviews →</Link>
                        </div>
                    </div>

                    {/* Emergency Share */}
                    <div className="glass-card" style={{ padding: 20, marginTop: 16, textAlign: 'center' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: 12, color: '#ef4444' }}>🆘 Emergency</h4>
                        <button
                            onClick={() => {
                                const msg = `I'm on a ride from ${ride.source} to ${ride.destination} with ${ride.driver?.name}. Driver phone: ${ride.driver?.phone || 'N/A'}`;
                                if (navigator.share) {
                                    navigator.share({ title: 'RideBuddy - Emergency Share', text: msg });
                                } else {
                                    navigator.clipboard.writeText(msg);
                                    setToast({ message: 'Ride details copied!', type: 'success' });
                                }
                            }}
                            className="btn-danger"
                            style={{ width: '100%' }}
                        >
                            📤 Share Ride Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideDetail;
