import { useState } from 'react';
import { ServiceRequestFormData, YardSizeCategory, ServiceType } from '../types';
import {
  createServiceRequest,
  getPostalAreas,
  getCurrentBookingsInArea
} from '../data/mockData';
import {
  calculatePrice,
  getEstimatedTime,
  formatPrice,
  DEFAULT_PRICING
} from '../utils/pricing';

export default function CustomerBooking() {
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    postalCode: '',
    address: '',
    yardSizeCategory: 'small',
    serviceType: 'both',
    requestedDate: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const postalAreas = getPostalAreas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estimatedTime = getEstimatedTime(formData.yardSizeCategory);

    createServiceRequest({
      ...formData,
      estimatedTimeMinutes: estimatedTime,
    });

    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        postalCode: '',
        address: '',
        yardSizeCategory: 'small',
        serviceType: 'both',
        requestedDate: '',
        notes: '',
      });
      setSubmitted(false);
      setEstimatedPrice(null);
    }, 3000);
  };

  const handleChange = (field: keyof ServiceRequestFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Calculate estimated price when relevant fields change
    if (field === 'postalCode' || field === 'yardSizeCategory') {
      if (newData.postalCode && newData.yardSizeCategory) {
        const bookingsInArea = getCurrentBookingsInArea(newData.postalCode) + 1; // +1 for current booking
        const estimatedTime = getEstimatedTime(newData.yardSizeCategory);
        const priceCalc = calculatePrice({
          estimatedTimeMinutes: estimatedTime,
          bookingsInSameArea: bookingsInArea,
        });
        setEstimatedPrice(priceCalc.totalPrice);
      }
    }
  };

  const currentBookingsInArea = formData.postalCode
    ? getCurrentBookingsInArea(formData.postalCode)
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tilaa lumityö
        </h1>
        <p className="text-gray-600 mb-6">
          Täytä alla olevat tiedot ja saat arvion lumityön hinnasta. Mitä enemmän asiakkaita samalta postinumeroalueelta, sitä halvempi hinta!
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Tilaus vastaanotettu!
            </h2>
            <p className="text-green-700">
              Otamme sinuun yhteyttä pian.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Postal Code Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postinumero
              </label>
              <select
                required
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Valitse postinumero</option>
                {postalAreas.map((area) => (
                  <option key={area.id} value={area.postalCode}>
                    {area.postalCode} - {area.city} ({area.areaName})
                  </option>
                ))}
              </select>
              {formData.postalCode && currentBookingsInArea > 0 && (
                <p className="mt-2 text-sm text-green-600">
                  💡 {currentBookingsInArea} muuta tilausta samalta alueelta - saat alennuksen!
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Osoite
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Esim. Mannerheimintie 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Yard Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pihan koko
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as YardSizeCategory[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleChange('yardSizeCategory', size)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.yardSizeCategory === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">
                      {size === 'small' && 'Pieni'}
                      {size === 'medium' && 'Keskikokoinen'}
                      {size === 'large' && 'Suuri'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {size === 'small' && '0-200m²'}
                      {size === 'medium' && '200-500m²'}
                      {size === 'large' && '500m+'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ~{getEstimatedTime(size)} min
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palvelun tyyppi
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['hand', 'machine', 'both'] as ServiceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('serviceType', type)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.serviceType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">
                      {type === 'hand' && '🧹 Käsin'}
                      {type === 'machine' && '🚜 Koneella'}
                      {type === 'both' && '🧹 + 🚜 Molemmat'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Requested Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toivottu päivämäärä (valinnainen)
              </label>
              <input
                type="date"
                value={formData.requestedDate}
                onChange={(e) => handleChange('requestedDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lisätiedot (valinnainen)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                placeholder="Esim. portti koodilla 1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price Estimate */}
            {estimatedPrice !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Arvioitu hinta</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Perusmaksu: {formatPrice(DEFAULT_PRICING.basePricePerArea / (currentBookingsInArea + 1))}
                      {currentBookingsInArea > 0 && (
                        <span className="text-green-600">
                          {' '}(jaettu {currentBookingsInArea + 1} asiakkaan kesken)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tuntihinta: {formatPrice(DEFAULT_PRICING.hourlyRate)}/h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(estimatedPrice)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Lähetä tilaus
            </button>
          </form>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Miten hinnoittelu toimii?
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Perusmaksu {formatPrice(DEFAULT_PRICING.basePricePerArea)} per postinumeroalue jaetaan kaikki saman alueen asiakkaiden kesken</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Tuntihinta {formatPrice(DEFAULT_PRICING.hourlyRate)}/h, laskutetaan {DEFAULT_PRICING.timeUnitMinutes} min tarkkuudella</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Esimerkki: 4 asiakasta samalta alueelta → perusmaksu 12,50€/asiakas (50€/4)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
