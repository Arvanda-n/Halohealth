import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Send, ChevronLeft, Loader2 } from 'lucide-react';

export default function Chat() {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // AMBIL PROFIL LAWAN BICARA
    const [receiverProfile, setReceiverProfile] = useState(
        location.state?.partner || location.state?.doctor || location.state?.user || null
    ); 
    
    const scrollRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return navigate('/login');

        // 1. Cek User Login
        fetch('http://127.0.0.1:8000/api/user', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setCurrentUser(data))
            .catch(err => console.error("Gagal load user:", err));

        // 2. Fetch data profil lawan bicara jika belum ada
        if (!receiverProfile) {
            fetch(`http://127.0.0.1:8000/api/users/${receiverId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.json())
                .then(data => setReceiverProfile(data.data || data))
                .catch(() => console.log("Profil lawan gagal di-fetch"));
        }

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/api/chat/${receiverId}`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) { 
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        const tempMsg = newMessage;
        setNewMessage(""); 

        try {
            const token = localStorage.getItem('token');
            await fetch('http://127.0.0.1:8000/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ receiver_id: parseInt(receiverId), message: tempMsg })
            });
            fetchMessages(); 
        } catch (err) {
            setNewMessage(tempMsg);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 🔥 REVISI LOGIC GAMBAR BIAR NYAMBUNG (SAMA DENGAN PROFILE & RECEIPT)
    const getProfileImage = () => {
        // Cek path gambar di berbagai level objek (Doctor relasi User, atau User langsung)
        const rawPath = 
            receiverProfile?.doctor?.image || 
            receiverProfile?.doctor?.user?.image || 
            receiverProfile?.image || 
            receiverProfile?.user?.image;

        if (!rawPath) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        
        // Jika sudah URL lengkap (http), gunakan langsung
        if (typeof rawPath === 'string' && rawPath.startsWith('http')) return rawPath;
        
        // Bersihkan path
        let cleanPath = rawPath.replace(/^public\//, '').replace(/^\//, '');
        
        // Sesuaikan dengan folder backend
        if (cleanPath.startsWith('uploads/')) {
             return `http://127.0.0.1:8000/${cleanPath}`;
        }
        
        return `http://127.0.0.1:8000/storage/${cleanPath}`;
    };

    const getName = () => {
        return receiverProfile?.doctor?.user?.name || receiverProfile?.doctor?.name || receiverProfile?.name || receiverProfile?.user?.name || "User";
    };

    const s = {
        page: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' },
        header: { flexShrink: 0, height: '70px', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', padding: '0 20px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
        avatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0', background: '#f1f5f9' },
        body: { flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
        bubbleMe: { maxWidth: '75%', padding: '12px 18px', borderRadius: '20px', borderBottomRightRadius: '4px', background: '#0ea5e9', color: 'white', alignSelf: 'flex-end', fontSize: '15px', boxShadow: '0 2px 5px rgba(14, 165, 233, 0.2)' },
        bubbleOther: { maxWidth: '75%', padding: '12px 18px', borderRadius: '20px', borderBottomLeftRadius: '4px', background: 'white', color: '#1e293b', alignSelf: 'flex-start', fontSize: '15px', border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
        timeMe: { fontSize: '10px', opacity: 0.8, marginTop: '4px', display: 'block', textAlign: 'right', color: '#e0f2fe' },
        timeOther: { fontSize: '10px', opacity: 0.6, marginTop: '4px', display: 'block', textAlign: 'right', color: '#64748b' },
        footer: { padding: '15px 20px', background: 'white', borderTop: '1px solid #e2e8f0' },
        inputBox: { display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '50px', padding: '8px 20px', border: '1px solid #e2e8f0' }
    };

    return (
        <div style={s.page}>
            <div style={s.header}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><ChevronLeft size={28}/></button>
                <img 
                    src={getProfileImage()} 
                    style={s.avatar} 
                    alt="Profile" 
                    onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                />
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{getName()}</h3>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', display:'flex', alignItems:'center', gap:'4px' }}>
                        <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div> Online
                    </span>
                </div>
            </div>

            <div style={s.body}>
                {loading && <div style={{textAlign:'center', marginTop:'20px'}}><Loader2 className="animate-spin" color="#94a3b8"/></div>}
                
                {!loading && messages.length === 0 && (
                    <div style={{textAlign:'center', color:'#94a3b8', marginTop:'50px', fontSize:'14px'}}>
                        <p>Belum ada percakapan.</p>
                        <p>Kirim pesan untuk memulai.</p>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                        <div key={i} style={isMe ? s.bubbleMe : s.bubbleOther}>
                            {msg.message}
                            <span style={isMe ? s.timeMe : s.timeOther}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={scrollRef}></div>
            </div>

            <div style={s.footer}>
                <div style={s.inputBox}>
                    <input 
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)} 
                        onKeyDown={handleKeyDown} 
                        placeholder="Ketik pesan..." 
                        style={{flex:1, border:'none', background:'transparent', outline:'none', fontSize:'15px', color:'#1e293b'}} 
                    />
                    <button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim()}
                        style={{background:'none', border:'none', cursor:'pointer', color: newMessage.trim() ? '#0ea5e9' : '#cbd5e1', marginLeft:'10px'}}
                    >
                        <Send size={24}/>
                    </button>
                </div>
            </div>
        </div>
    );
}