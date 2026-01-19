import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Send, ChevronLeft, MoreVertical, Loader2, Plus } from 'lucide-react';

export default function Chat() {
    const { receiverId } = useParams(); // ID User lawan bicara
    const navigate = useNavigate();
    const location = useLocation();
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [receiverProfile, setReceiverProfile] = useState(location.state?.doctor || null); 
    
    const scrollRef = useRef();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return navigate('/login');

        // 1. Ambil data diri
        fetch('http://127.0.0.1:8000/api/user', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setCurrentUser(data));

        // 2. Fetch data lawan bicara kalau belum ada
        if (!receiverProfile || (receiverProfile.id != receiverId && receiverProfile.user_id != receiverId)) {
            fetchReceiverProfile(token);
        }

        // 3. Load Chat & Auto Refresh (Polling)
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Cek pesan baru tiap 3 detik
        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchReceiverProfile = async (token) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/${receiverId}`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (response.ok) {
                const data = await response.json();
                setReceiverProfile(data.data || data); 
            }
        } catch (error) { console.log("Error profil", error); }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/chat/${receiverId}`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            const data = await response.json();
            // Validasi array biar gak error map
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetch chat:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 LOGIC KIRIM PESAN (FIXED)
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Pastikan receiver_id dikirim sebagai Angka (Integer)
                body: JSON.stringify({
                    receiver_id: parseInt(receiverId), 
                    message: newMessage
                })
            });

            if (response.ok) {
                setNewMessage(""); // Kosongkan input
                fetchMessages();   // Tarik pesan baru segera
            } else {
                console.error("Gagal kirim pesan");
            }
        } catch (err) {
            console.error("Error koneksi:", err);
        }
    };

    // Helper Foto
    const getProfileImage = () => {
        let imagePath = receiverProfile?.image || receiverProfile?.user?.image || receiverProfile?.photo;
        if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
        if (imagePath.startsWith('http')) return imagePath;
        return `http://127.0.0.1:8000/storage/${imagePath.replace(/^\//, '')}`;
    };

    const getName = () => receiverProfile?.name || receiverProfile?.user?.name || "Dokter";

    // STYLE FULL WIDTH
    const styles = {
        page: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#ffffff', fontFamily: '"Inter", sans-serif' },
        header: { 
            flexShrink: 0, height: '70px', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', padding: '0 20px', 
            borderBottom: '1px solid #f1f5f9', zIndex:10 
        },
        avatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' },
        body: { flexGrow: 1, overflowY: 'auto', padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: '10px', background: 'white' },
        
        // FOOTER FULL WIDTH
        footer: { 
            flexShrink: 0, background: 'white', padding: '20px 0', width: '100%', borderTop: '1px solid #f1f5f9'
        },
        form: {
            display: 'flex', width: '100%', alignItems: 'center'
        },
        inputContainer: { 
            background: '#f0f4f9', borderRadius: '50px', display: 'flex', alignItems: 'center', padding: '12px 25px', 
            margin: '0 20px', flex: 1 
        },
        input: { flex: 1, border: 'none', outline: 'none', fontSize: '16px', marginLeft: '10px', background: 'transparent', color:'#1e293b' },
        iconBtn: { background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center' },
        sendBtn: { background:'none', border:'none', cursor:'pointer', color:'#0ea5e9', display:'flex', alignItems:'center', marginLeft:'10px' },
        
        bubbleUser: { maxWidth: '75%', padding: '12px 18px', borderRadius: '20px', borderBottomRightRadius: '4px', background: '#0ea5e9', color: 'white', alignSelf: 'flex-end', fontSize: '15px' },
        bubblePartner: { maxWidth: '75%', padding: '12px 18px', borderRadius: '20px', borderBottomLeftRadius: '4px', background: '#f1f5f9', color: '#1e293b', alignSelf: 'flex-start', fontSize: '15px' },
        time: { fontSize: '10px', opacity: 0.7, marginTop: '4px', display:'block', textAlign: 'right' }
    };

    return (
        <div style={styles.page}>
            <input type="file" ref={fileInputRef} style={{display:'none'}} />

            {/* HEADER */}
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={{background:'none', border:'none', cursor:'pointer', color:'#64748b'}}><ChevronLeft size={28}/></button>
                <img src={getProfileImage()} alt="Profile" style={styles.avatar} onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}/>
                <div style={{flex:1}}>
                    <h3 style={{margin:0, fontSize:'16px', fontWeight:'700', color:'#1e293b'}}>{getName()}</h3>
                    <span style={{fontSize:'12px', color:'#10b981', fontWeight:'500'}}>Online</span>
                </div>
                <MoreVertical size={24} color="#64748b"/>
            </div>

            {/* CHAT BODY */}
            <div style={styles.body}>
                {loading && <div style={{textAlign:'center', marginTop:'20px'}}><Loader2 className="animate-spin inline text-gray-300"/></div>}
                {!loading && messages.length === 0 && (
                    <div style={{textAlign:'center', margin:'auto', color:'#94a3b8', fontSize:'14px'}}>
                        Mulai percakapan baru.
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                        <div key={i} style={isMe ? styles.bubbleUser : styles.bubblePartner}>
                            {msg.message}
                            <span style={styles.time}>{new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                    );
                })}
                <div ref={scrollRef}></div>
            </div>

            {/* FOOTER PAKE FORM BIAR ENTER JALAN */}
            <div style={styles.footer}>
                <form onSubmit={handleSendMessage} style={styles.form}>
                    <div style={styles.inputContainer}>
                        <button type="button" style={styles.iconBtn} onClick={() => fileInputRef.current.click()}>
                            <Plus size={24}/>
                        </button>
                        <input 
                            value={newMessage} 
                            onChange={e => setNewMessage(e.target.value)} 
                            placeholder="Ketik pesan..." 
                            style={styles.input} 
                        />
                        <button type="submit" disabled={!newMessage.trim()} style={styles.sendBtn}>
                            <Send size={26}/> 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}