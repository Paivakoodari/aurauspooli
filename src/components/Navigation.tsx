import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">❄️</span>
            <span className="text-xl font-bold text-gray-800">Aurauspooli</span>
          </Link>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Etusivu
            </Link>
            <Link
              to="/customer"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/customer')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tilaa lumityö
            </Link>
            <Link
              to="/operator"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/operator')
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tarjoa palvelua
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
