import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Tambah useLocation
import { Send, ChevronLeft, MoreVertical, Loader2 } from 'lucide-react';

export default function Chat() {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Buat nangkep data dari halaman sebelumnya
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    
    // 🔥 LOGIKA BARU: Cek apakah data dokter dikirim lewat navigate? Kalau ada pake itu, kalau gak ada baru null.
    const [receiverProfile, setReceiverProfile] = useState(location.state?.doctor || null); 
    
    const scrollRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return navigate('/login');

        // 1. Ambil data diri sendiri
        fetch('http://127.0.0.1:8000/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setCurrentUser(data));

        // 2. Kalau profil dokter belum ada (gak dikirim dari halaman sebelah), coba fetch manual
        if (!receiverProfile) {
            fetchReceiverProfile(token);
        }

        // 3. Ambil Pesan & Polling
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fungsi Fetch Profil (Jaga-jaga kalau endpointnya beda)
    const fetchReceiverProfile = async (token) => {
        try {
            // Coba ambil data user/dokter berdasarkan ID
            const response = await fetch(`http://127.0.0.1:8000/api/users/${receiverId}`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setReceiverProfile(data);
            } else {
                // Kalau gagal fetch, set nama default biar gak loading terus
                setReceiverProfile({ name: "Dokter", image: null });
            }
        } catch (error) {
            console.log("Gagal load profil", error);
            setReceiverProfile({ name: "Dokter", image: null });
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/chat/${receiverId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching chat:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_id: receiverId,
                    message: newMessage
                })
            });

            if (response.ok) {
                setNewMessage("");
                fetchMessages();
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const styles = {
        container: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#e5ddd5', fontFamily: '"Inter", sans-serif' },
        subHeader: {
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
            background: '#ffffff', height: '70px',
            display: 'flex', alignItems: 'center', gap: '15px', padding: '0 15px',
            borderBottom: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        },
        avatarBox: { width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eee' },
        avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
        chatBody: {
            flex: 1, marginTop: '70px', marginBottom: '70px', overflowY: 'auto', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '8px', background: '#efe7dd'
        },
        bubble: (isMe) => ({
            maxWidth: '75%', padding: '10px 14px', borderRadius: '12px',
            borderTopRightRadius: isMe ? '0' : '12px',
            borderTopLeftRadius: isMe ? '12px' : '0',
            background: isMe ? '#d9fdd3' : '#ffffff',
            color: '#111b21', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            position: 'relative', wordWrap: 'break-word'
        }),
        time: { fontSize: '10px', color: '#999', marginTop: '4px', textAlign: 'right', display: 'block' },
        inputArea: {
            position: 'fixed', bottom: 0, left: 0, right: 0, background: '#f0f2f5',
            padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 60
        },
        // 🔥 FIX TOMBOL SEND
        sendButton: { 
            background: '#00a884', 
            border: 'none', 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            color: 'white',
            padding: 0, // Hapus padding biar icon bener-bener di tengah
            flexShrink: 0 
        }
    };

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.subHeader}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
                    <ChevronLeft size={26} color="#54656f" />
                </button>
                
                <div style={styles.avatarBox}>
                    <img 
                        src={receiverProfile?.image ? `http://127.0.0.1:8000${receiverProfile.image}` : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                        alt="Profile" style={styles.avatarImg}
                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                    />
                </div>
                
                <div style={{ flex: 1, cursor:'pointer' }}>
                    {/* Jika nama belum ke-load, tampilkan "Dokter" */}
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111b21' }}>
                        {receiverProfile?.name || "Dokter"}
                    </h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Online</p>
                </div>

                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <MoreVertical size={22} color="#54656f" />
                </button>
            </div>

            {/* CHAT BODY */}
            <div style={styles.chatBody}>
                {loading && <div style={{ textAlign:'center', marginTop:'20px' }}><Loader2 className="animate-spin inline text-gray-400"/></div>}
                
                {/* Pesan default kalau chat masih kosong */}
                {!loading && messages.length === 0 && (
                    <div style={{ textAlign:'center', marginTop:'50px', color:'#8696a0', fontSize:'13px', background:'rgba(255,255,255,0.9)', padding:'10px 20px', borderRadius:'20px', width:'fit-content', margin:'50px auto' }}>
                        Mulai konsultasi dengan <b>{receiverProfile?.name || "Dokter"}</b>.
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                        <div key={index} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                            <div style={styles.bubble(isMe)}>
                                {msg.message}
                                <span style={styles.time}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={handleSendMessage} style={styles.inputArea}>
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: 'none', outline: 'none', fontSize: '15px', background:'white' }}
                />
                <button type="submit" disabled={!newMessage.trim()} style={styles.sendButton}>
                    {/* Size diperbesar dikit biar pas */}
                    <Send size={22} style={{ marginLeft: '2px' }} /> 
                </button>
            </form>
        </div>
    );
}