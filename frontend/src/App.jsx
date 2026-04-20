import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripResult from './pages/TripResult';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip/:id" element={<TripResult />} />
    </Routes>
  );
}
