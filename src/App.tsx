import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import CustomerBooking from './pages/CustomerBooking';
import OperatorService from './pages/OperatorService';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<CustomerBooking />} />
            <Route path="/operator" element={<OperatorService />} />
          </Routes>
        </main>
        <footer className="mt-16 py-8 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              Aurauspooli - Yhdistämme lumityön tarvitsijat ja tekijät
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Prototype v1.0 - Built with React, TypeScript & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
