import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRide } from '../api';
import Toast from '../components/Toast';

const PostRide = () => {
    const [form, setForm] = useState({
        source: '', destination: '', date: '', time: '',
        seatsTotal: 1, vehicleType: 'car', costPerSeat: 0, routeDescription: '',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const update = (field, value) => setForm({ ...form, [field]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRide({ ...form, seatsTotal: parseInt(form.seatsTotal), costPerSeat: parseFloat(form.costPerSeat) });
            setToast({ message: 'Ride posted successfully!', type: 'success' });
            setTimeout(() => navigate('/my-rides'), 1500);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to post ride', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div className="page-container">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <div className="animate-fadeInUp">
                <h1 className="page-title">🚗 Post a Ride</h1>
                <p className="page-subtitle">Share your ride with fellow students</p>
            </div>

            <div className="glass-card animate-fadeInUp" style={{ maxWidth: 600, padding: 32 }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label className="form-label">Source / Pickup *</label>
                            <input id="ride-source" className="form-input" placeholder="e.g. Main Gate" value={form.source} onChange={(e) => update('source', e.target.value)} required />
                        </div>
                        <div>
                            <label className="form-label">Destination *</label>
                            <input id="ride-dest" className="form-input" placeholder="e.g. City Center" value={form.destination} onChange={(e) => update('destination', e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label className="form-label">Date *</label>
                            <input id="ride-date" type="date" className="form-input" value={form.date} onChange={(e) => update('date', e.target.value)} required />
                        </div>
                        <div>
                            <label className="form-label">Time *</label>
                            <input id="ride-time" type="time" className="form-input" value={form.time} onChange={(e) => update('time', e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label className="form-label">Vehicle Type *</label>
                            <select id="ride-vehicle" className="form-select" value={form.vehicleType} onChange={(e) => update('vehicleType', e.target.value)}>
                                <option value="car">🚗 Car</option>
                                <option value="bike">🏍️ Bike</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Total Seats *</label>
                            <input id="ride-seats" type="number" className="form-input" min="1" max="10" value={form.seatsTotal} onChange={(e) => update('seatsTotal', e.target.value)} required />
                        </div>
                        <div>
                            <label className="form-label">Cost / Seat (₹)</label>
                            <input id="ride-cost" type="number" className="form-input" min="0" step="5" value={form.costPerSeat} onChange={(e) => update('costPerSeat', e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label className="form-label">Route Description (optional)</label>
                        <textarea id="ride-desc" className="form-input" rows="3" placeholder="Via Highway 1, stop at Mall junction..." value={form.routeDescription} onChange={(e) => update('routeDescription', e.target.value)} style={{ resize: 'vertical' }} />
                    </div>

                    <button type="submit" id="ride-submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }}>
                        {loading ? '⏳ Posting...' : '🚀 Post Ride'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostRide;
