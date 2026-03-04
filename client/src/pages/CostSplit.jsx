import { useState } from 'react';

const CostSplit = () => {
    const [form, setForm] = useState({ totalDistance: '', fuelPrice: '', mileage: '', passengers: 2 });
    const [result, setResult] = useState(null);

    const calculate = (e) => {
        e.preventDefault();
        const dist = parseFloat(form.totalDistance);
        const fuel = parseFloat(form.fuelPrice);
        const mil = parseFloat(form.mileage);
        const pax = parseInt(form.passengers);

        if (!dist || !fuel || !mil || !pax) return;

        const fuelNeeded = dist / mil;
        const totalCost = fuelNeeded * fuel;
        const costPerPerson = totalCost / pax;

        setResult({
            fuelNeeded: fuelNeeded.toFixed(2),
            totalCost: totalCost.toFixed(2),
            costPerPerson: costPerPerson.toFixed(2),
            passengers: pax,
        });
    };

    return (
        <div className="page-container">
            <div className="animate-fadeInUp">
                <h1 className="page-title">💰 Cost Split Calculator</h1>
                <p className="page-subtitle">Calculate fair fuel sharing among riders</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 800 }}>
                <div className="glass-card animate-fadeInUp" style={{ padding: 28 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Enter Trip Details</h3>
                    <form onSubmit={calculate}>
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label">Total Distance (km)</label>
                            <input id="split-distance" type="number" className="form-input" placeholder="e.g. 25" value={form.totalDistance} onChange={(e) => setForm({ ...form, totalDistance: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label">Fuel Price (₹/litre)</label>
                            <input id="split-fuel" type="number" step="0.01" className="form-input" placeholder="e.g. 105" value={form.fuelPrice} onChange={(e) => setForm({ ...form, fuelPrice: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label">Vehicle Mileage (km/litre)</label>
                            <input id="split-mileage" type="number" step="0.1" className="form-input" placeholder="e.g. 15" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label className="form-label">Number of Passengers (incl. driver)</label>
                            <input id="split-pax" type="number" min="1" max="10" className="form-input" value={form.passengers} onChange={(e) => setForm({ ...form, passengers: e.target.value })} required />
                        </div>
                        <button type="submit" id="split-calc-btn" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            🧮 Calculate
                        </button>
                    </form>
                </div>

                <div className="glass-card animate-fadeInUp" style={{ padding: 28 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>💡 Results</h3>
                    {result ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="stat-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#64748b' }}>Fuel Needed</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#06b6d4' }}>{result.fuelNeeded} L</div>
                            </div>
                            <div className="stat-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: '#64748b' }}>Total Trip Cost</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>₹{result.totalCost}</div>
                            </div>
                            <div className="stat-card pulse-glow" style={{ textAlign: 'center', background: 'rgba(99, 102, 241, 0.1)' }}>
                                <div style={{ fontSize: 12, color: '#64748b' }}>Cost Per Person ({result.passengers} people)</div>
                                <div style={{ fontSize: 32, fontWeight: 800 }} className="gradient-text">₹{result.costPerPerson}</div>
                            </div>
                            <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.05)', borderRadius: 10, fontSize: 13, color: '#10b981', textAlign: 'center' }}>
                                💚 You save ₹{(parseFloat(result.totalCost) - parseFloat(result.costPerPerson)).toFixed(2)} by sharing!
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🧮</div>
                            <p>Enter trip details to see the cost breakdown</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostSplit;
