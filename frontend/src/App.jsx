import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripResult from './pages/TripResult';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute><TripResult /></ProtectedRoute>} />
    </Routes>
  );
}
