import { useState } from 'react';
import { OperatorServiceFormData, ServiceType } from '../types';
import {
  createOperatorService,
  getPostalAreas,
  getOperatorServices,
} from '../data/mockData';

export default function OperatorService() {
  const [formData, setFormData] = useState<OperatorServiceFormData>({
    postalCode: '',
    serviceType: 'both',
    maxCapacityPerDay: undefined,
    equipmentDescription: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [myServices, setMyServices] = useState(getOperatorServices());

  const postalAreas = getPostalAreas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createOperatorService({
      postalCode: formData.postalCode,
      serviceType: formData.serviceType,
      maxCapacityPerDay: formData.maxCapacityPerDay,
      equipmentDescription: formData.equipmentDescription,
    });

    setSubmitted(true);
    setMyServices(getOperatorServices());

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        postalCode: '',
        serviceType: 'both',
        maxCapacityPerDay: undefined,
        equipmentDescription: '',
      });
      setSubmitted(false);
    }, 2000);
  };

  const handleChange = (field: keyof OperatorServiceFormData, value: string | number | undefined) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tarjoa lumityöpalvelua
        </h1>
        <p className="text-gray-600 mb-6">
          Ilmoita alueesi ja tarjoamasi palvelut. Saat automaattisesti yhteydenottopyyntöjä asiakkailta.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Palvelu lisätty!
            </h2>
            <p className="text-green-700">
              Palvelusi on nyt näkyvissä asiakkaille.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Postal Code Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postinumeroalue jolla tarjoat palvelua
              </label>
              <select
                required
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Valitse postinumero</option>
                {postalAreas.map((area) => (
                  <option key={area.id} value={area.postalCode}>
                    {area.postalCode} - {area.city} ({area.areaName})
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarjoamasi palvelu
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['hand', 'machine', 'both'] as ServiceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('serviceType', type)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.serviceType === type
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">
                      {type === 'hand' && '🧹 Käsityö'}
                      {type === 'machine' && '🚜 Konetyö'}
                      {type === 'both' && '🧹 + 🚜 Molemmat'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimi kapasiteetti per päivä (valinnainen)
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxCapacityPerDay || ''}
                onChange={(e) =>
                  handleChange('maxCapacityPerDay', e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="Esim. 10 työkohde/päivä"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Kuinka monta kohdetta pystyt hoitamaan päivässä?
              </p>
            </div>

            {/* Equipment Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kaluston kuvaus (valinnainen)
              </label>
              <textarea
                value={formData.equipmentDescription}
                onChange={(e) => handleChange('equipmentDescription', e.target.value)}
                rows={3}
                placeholder="Esim. Traktori lumiaura ja -linko, lumilapio"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Lisää palvelu
            </button>
          </form>
        )}
      </div>

      {/* My Services */}
      {myServices.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Omat palveluni ({myServices.length})
          </h2>
          <div className="space-y-3">
            {myServices.map((service) => {
              const area = postalAreas.find(a => a.postalCode === service.postalCode);
              return (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg text-gray-800">
                        {service.postalCode} - {area?.city} ({area?.areaName})
                      </div>
                      <div className="text-gray-600 mt-1">
                        {service.serviceType === 'hand' && '🧹 Käsityö'}
                        {service.serviceType === 'machine' && '🚜 Konetyö'}
                        {service.serviceType === 'both' && '🧹 + 🚜 Molemmat'}
                      </div>
                      {service.maxCapacityPerDay && (
                        <div className="text-sm text-gray-500 mt-1">
                          Kapasiteetti: {service.maxCapacityPerDay} työkohde/päivä
                        </div>
                      )}
                      {service.equipmentDescription && (
                        <div className="text-sm text-gray-500 mt-1">
                          Kalusto: {service.equipmentDescription}
                        </div>
                      )}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          service.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.available ? 'Aktiivinen' : 'Ei aktiivinen'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Miten palvelu toimii?
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">1.</span>
            <span>Ilmoita postinumeroalueet joilla tarjoat lumityöpalvelua</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">2.</span>
            <span>Asiakkaat näkevät palvelusi kun he tilaavat lumitöitä</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">3.</span>
            <span>Saat automaattisesti yhteydenottopyyntöjä asiakkailta</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">4.</span>
            <span>Mitä enemmän asiakkaita samalta alueelta, sitä tehokkaammin pystyt optimoimaan reitit</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
