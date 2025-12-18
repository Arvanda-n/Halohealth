export default function DoctorCard({ doctor }) {
return (
<div className="doctor-card">
<div className="doctor-name">{doctor.name}</div>
<div className="doctor-specialist">{doctor.specialist}</div>


<div className="doctor-footer">
<span className="price">Rp {doctor.price}</span>
<button className="btn">Chat</button>
</div>
</div>
);
}