import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ===== USER PAGES =====
import Home from './pages/home';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Medicines from './pages/Medicines';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Cart from './pages/Cart';
import BookingCheckout from './pages/BookingCheckout';
import Login from './pages/login';
import Register from './pages/Register';

// ===== CEK KESEHATAN =====
import CekStress from './pages/CekStress';
import BMI from './pages/BMI';

// ===== ADMIN =====
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/AdminArticles';
import AdminArticleCreate from './pages/admin/AdminArticleCreate';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminDoctorCreate from './pages/admin/AdminDoctorCreate';
import AdminDoctorEdit from './pages/admin/AdminDoctorEdit';
import AdminMedicines from './pages/admin/AdminMedicines';
import AdminMedicineCreate from './pages/admin/AdminMedicineCreate';
import AdminMedicineEdit from './pages/admin/AdminMedicineEdit';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminOrders from './pages/admin/AdminOrders';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/booking-checkout" element={<BookingCheckout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== CEK KESEHATAN ===== */}
        <Route path="/cek-stress" element={<CekStress />} />
        <Route path="/bmi" element={<BMI />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/create" element={<AdminArticleCreate />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="doctors/create" element={<AdminDoctorCreate />} />
          <Route path="doctors/edit/:id" element={<AdminDoctorEdit />} />
          <Route path="medicines" element={<AdminMedicines />} />
          <Route path="medicines/create" element={<AdminMedicineCreate />} />
          <Route path="medicines/edit/:id" element={<AdminMedicineEdit />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
