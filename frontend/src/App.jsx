import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Doctors from './pages/Doctors'
import Login from './pages/login'
import Register from './pages/Register' 
import Medicines from './pages/Medicines'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/medicines" element={<Medicines />} />
        
      </Routes>
    </BrowserRouter>
  )
}