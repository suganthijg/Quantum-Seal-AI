import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/components/Toast';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Manufacturer from '@/pages/Manufacturer';
import Retailer from '@/pages/Retailer';
import Customer from '@/pages/Customer';
import Admin from '@/pages/Admin';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manufacturer/*" element={<Manufacturer />} />
        <Route path="/retailer/*" element={<Retailer />} />
        <Route path="/customer/*" element={<Customer />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
