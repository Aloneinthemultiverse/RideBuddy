import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getConversation, sendMessage, getAllConversations } from '../api';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { rideId, userId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const inConversation = rideId && userId;

    const loadConversations = async () => {
        try {
            const { data } = await getAllConversations();
            setConversations(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const loadMessages = async () => {
        try {
            const { data } = await getConversation(rideId, userId);
            setMessages(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => {
        if (inConversation) {
            loadMessages();
            const interval = setInterval(loadMessages, 5000);
            return () => clearInterval(interval);
        } else {
            loadConversations();
        }
    }, [rideId, userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await sendMessage({ receiverId: userId, rideId, text });
            setText('');
            loadMessages();
        } catch (err) { console.error(err); }
    };

    // Conversation list view
    if (!inConversation) {
        return (
            <div className="page-container">
                <div className="animate-fadeInUp">
                    <h1 className="page-title">💬 Messages</h1>
                    <p className="page-subtitle">Your conversations with riders and passengers</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                        <p style={{ color: '#64748b' }}>No conversations yet. Start by requesting a ride!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {conversations.map((conv, i) => (
                            <a
                                key={i}
                                href={`/chat/${conv._id?.ride?._id}/${conv._id?.otherUser?._id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="glass-card glass-card-hover" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                                        {conv._id?.otherUser?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{conv._id?.otherUser?.name}</span>
                                            <span style={{ fontSize: 11, color: '#64748b' }}>{new Date(conv.lastTime).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                                            {conv._id?.ride?.source} → {conv._id?.ride?.destination}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {conv.lastMessage}
                                        </div>
                                    </div>
                                    {conv.unread > 0 && (
                                        <div style={{ background: '#6366f1', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                                            {conv.unread}
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Conversation view
    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
            <div className="glass-card" style={{ padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <a href="/chat" style={{ color: '#818cf8', textDecoration: 'none', fontSize: 14 }}>← Back</a>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                    💬
                </div>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Conversation</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No messages yet. Say hi! 👋</div>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} style={{ display: 'flex', justifyContent: msg.sender._id === user._id ? 'flex-end' : 'flex-start' }}>
                            <div className={`chat-bubble ${msg.sender._id === user._id ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                                <div>{msg.text}</div>
                                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, paddingTop: 12 }}>
                <input
                    id="chat-input"
                    className="form-input"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button type="submit" id="chat-send" className="btn-primary" style={{ padding: '12px 20px' }}>
                    📤 Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
