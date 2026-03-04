import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserReviews, getUserProfile, createReview, reportUser } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Reviews = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', rideId: '' });
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [profileRes, reviewsRes] = await Promise.all([getUserProfile(userId), getUserReviews(userId)]);
                setProfile(profileRes.data);
                setReviews(reviewsRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, [userId]);

    const handleReview = async (e) => {
        e.preventDefault();
        try {
            await createReview({ revieweeId: userId, rideId: reviewForm.rideId, rating: reviewForm.rating, comment: reviewForm.comment });
            setToast({ message: 'Review submitted!', type: 'success' });
            setShowReviewForm(false);
            const { data } = await getUserReviews(userId);
            setReviews(data);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        try {
            await reportUser({ reportedUserId: userId, reason: reportReason });
            setToast({ message: 'Report submitted!', type: 'success' });
            setShowReportForm(false);
            setReportReason('');
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed', type: 'error' });
        }
    };

    const renderStars = (rating) => '⭐'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

    if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;

    return (
        <div className="page-container">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* User Profile Header */}
            <div className="glass-card animate-fadeInUp" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {profile?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 22, color: '#e2e8f0' }}>{profile?.name}</h2>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>{profile?.department} • Year {profile?.year}</p>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>⭐ {profile?.rating?.toFixed(1) || '0.0'} ({profile?.totalRatings || 0} reviews)</span>
                        <span style={{ color: '#6366f1', fontWeight: 600 }}>🚗 {profile?.rideCount || 0} rides</span>
                    </div>
                </div>
                {userId !== user?._id && (
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                        <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-primary" style={{ fontSize: 12 }}>⭐ Review</button>
                        <button onClick={() => setShowReportForm(!showReportForm)} className="btn-danger" style={{ fontSize: 12, padding: '8px 16px' }}>🚩 Report</button>
                    </div>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="glass-card animate-fadeInUp" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Leave a Review</h3>
                    <form onSubmit={handleReview}>
                        <div style={{ marginBottom: 12 }}>
                            <label className="form-label">Ride ID (from your ride history)</label>
                            <input className="form-input" placeholder="Paste ride ID" value={reviewForm.rideId} onChange={(e) => setReviewForm({ ...reviewForm, rideId: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label className="form-label">Rating</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <span key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })} style={{ fontSize: 28, cursor: 'pointer', transition: 'transform 0.2s' }} className="star">
                                        {s <= reviewForm.rating ? '⭐' : '☆'}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label">Comment</label>
                            <textarea className="form-input" rows="3" placeholder="Share your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                        </div>
                        <button type="submit" className="btn-primary">Submit Review</button>
                    </form>
                </div>
            )}

            {/* Report Form */}
            {showReportForm && (
                <div className="glass-card animate-fadeInUp" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#ef4444' }}>🚩 Report User</h3>
                    <form onSubmit={handleReport}>
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label">Reason</label>
                            <textarea className="form-input" rows="3" placeholder="Describe the issue..." value={reportReason} onChange={(e) => setReportReason(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-danger">Submit Report</button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📝 Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                    <p style={{ color: '#64748b' }}>No reviews yet</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {reviews.map(review => (
                        <div key={review._id} className="glass-card" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                                        {review.reviewer?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{review.reviewer?.name}</span>
                                        <div style={{ fontSize: 11, color: '#64748b' }}>{review.reviewer?.department}</div>
                                    </div>
                                </div>
                                <span style={{ color: '#f59e0b', fontSize: 14 }}>{renderStars(review.rating)}</span>
                            </div>
                            {review.comment && <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>{review.comment}</p>}
                            {review.ride && <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Ride: {review.ride.source} → {review.ride.destination} ({review.ride.date})</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
