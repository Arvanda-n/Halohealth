import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Doctors from './pages/Doctors'
import Login from './pages/login'
import Register from './pages/Register' 
import Medicines from './pages/Medicines'
import DoctorDetail from './pages/DoctorDetail';
import BookingCheckout from './pages/BookingCheckout';
import Cart from './pages/Cart'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/booking-checkout" element={<BookingCheckout />} />
        <Route path="/cart" element={<Cart />} />
        
      </Routes>
    </BrowserRouter>
  )
}