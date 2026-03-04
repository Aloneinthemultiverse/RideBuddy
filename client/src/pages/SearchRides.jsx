import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchRides } from '../api';

const SearchRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ source: '', destination: '', date: '', vehicleType: '' });

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.source) params.source = filters.source;
            if (filters.destination) params.destination = filters.destination;
            if (filters.date) params.date = filters.date;
            if (filters.vehicleType) params.vehicleType = filters.vehicleType;
            const { data } = await searchRides(params);
            setRides(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { handleSearch(); }, []);

    return (
        <div className="page-container">
            <div className="animate-fadeInUp">
                <h1 className="page-title">🔍 Find a Ride</h1>
                <p className="page-subtitle">Search available rides from fellow students</p>
            </div>

            {/* Filters */}
            <div className="glass-card animate-fadeInUp" style={{ padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'end' }}>
                    <div>
                        <label className="form-label">Source</label>
                        <input id="filter-source" className="form-input" placeholder="From..." value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Destination</label>
                        <input id="filter-dest" className="form-input" placeholder="To..." value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Date</label>
                        <input id="filter-date" type="date" className="form-input" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                    </div>
                    <div>
                        <label className="form-label">Vehicle</label>
                        <select id="filter-vehicle" className="form-select" value={filters.vehicleType} onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}>
                            <option value="">All</option>
                            <option value="car">🚗 Car</option>
                            <option value="bike">🏍️ Bike</option>
                        </select>
                    </div>
                    <button onClick={handleSearch} id="search-btn" className="btn-primary" style={{ height: 44 }}>
                        🔍 Search
                    </button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Searching...</div>
            ) : rides.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                    <p style={{ color: '#64748b' }}>No rides found matching your criteria</p>
                </div>
            ) : (
                <>
                    <p style={{ color: '#64748b', marginBottom: 16, fontSize: 14 }}>{rides.length} ride{rides.length !== 1 ? 's' : ''} found</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                        {rides.map(ride => (
                            <Link key={ride._id} to={`/ride/${ride._id}`} style={{ textDecoration: 'none' }}>
                                <div className="glass-card glass-card-hover" style={{ padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <span className={`badge badge-${ride.vehicleType}`}>{ride.vehicleType === 'car' ? '🚗 Car' : '🏍️ Bike'}</span>
                                        <span className={`badge ${ride.seatsAvailable > 0 ? 'badge-active' : 'badge-cancelled'}`}>
                                            {ride.seatsAvailable > 0 ? `${ride.seatsAvailable} seats left` : 'Full'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <span style={{ color: '#10b981' }}>📍</span>
                                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.source}</span>
                                        <span style={{ color: '#64748b' }}>→</span>
                                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{ride.destination}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>
                                        <span>📅 {ride.date}</span>
                                        <span>🕐 {ride.time}</span>
                                        {ride.costPerSeat > 0 && <span>💰 ₹{ride.costPerSeat}</span>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                                            {ride.driver?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{ride.driver?.name}</span>
                                        {ride.driver?.rating > 0 && <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {ride.driver.rating.toFixed(1)}</span>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchRides;
