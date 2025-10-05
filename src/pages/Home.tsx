import { Link } from 'react-router-dom';
import { getServiceRequests, getOperatorServices } from '../data/mockData';

export default function Home() {
  const serviceRequests = getServiceRequests();
  const operatorServices = getOperatorServices();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Aurauspooli
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Yhdistämme lumityön tarvitsijat ja tekijät
        </p>
        <p className="text-lg text-gray-500">
          Ryhmätilaukset = Halvempi hinta 💰
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Customer Card */}
        <Link
          to="/customer"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Tarvitsen lumityötä
            </h2>
            <p className="text-gray-600 mb-4">
              Tilaa lumityö kotipihallesi. Mitä enemmän naapureita tilaa, sitä halvemmaksi tulee!
            </p>
            <div className="bg-blue-50 text-blue-700 py-2 px-4 rounded-lg inline-block font-medium">
              Tilaa lumityö →
            </div>
          </div>
        </Link>

        {/* Operator Card */}
        <Link
          to="/operator"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚜</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Tarjoan lumityöpalvelua
            </h2>
            <p className="text-gray-600 mb-4">
              Ilmoita alueesi ja tarjoa lumityöpalveluita. Optimoi reitit ja maksimoi tehokkuus!
            </p>
            <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg inline-block font-medium">
              Tarjoa palvelua →
            </div>
          </div>
        </Link>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Miten Aurauspooli toimii?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Tilaa lumityö</h3>
            <p className="text-gray-600">
              Asiakkaat tilaavat lumityön postinumeroalueellaan
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Ryhmäetu</h3>
            <p className="text-gray-600">
              Perusmaksu jaetaan kaikkien saman alueen tilaajien kesken
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Tehokas toteutus</h3>
            <p className="text-gray-600">
              Operaattorit hoitavat useita kohteita tehokkaasti samalla alueella
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Example */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Hinnoittelu esimerkki
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-center">
              1 asiakas alueella
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Perusmaksu:</span>
                <span className="font-medium">50,00€</span>
              </div>
              <div className="flex justify-between">
                <span>Työ (15 min):</span>
                <span className="font-medium">25,00€</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Yhteensä:</span>
                <span className="text-blue-600">75,00€</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-green-500">
            <div className="text-green-600 text-center font-medium mb-2">
              ⭐ Ryhmäalennus!
            </div>
            <h3 className="font-semibold text-lg mb-3 text-center">
              4 asiakasta alueella
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Perusmaksu:</span>
                <span className="font-medium">12,50€ <span className="text-sm text-green-600">(50€/4)</span></span>
              </div>
              <div className="flex justify-between">
                <span>Työ (15 min):</span>
                <span className="font-medium">25,00€</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Yhteensä:</span>
                <span className="text-green-600">37,50€</span>
              </div>
            </div>
            <div className="mt-3 text-center text-sm text-green-700 bg-green-50 py-2 rounded">
              Säästit 37,50€! (-50%)
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {serviceRequests.length}
          </div>
          <div className="text-gray-600">Lumityötilausta</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {operatorServices.length}
          </div>
          <div className="text-gray-600">Palveluntarjoajaa</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            10
          </div>
          <div className="text-gray-600">Postinumeroaluetta</div>
        </div>
      </div>
    </div>
  );
}
