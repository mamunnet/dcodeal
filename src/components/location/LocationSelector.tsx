import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { LocationService } from '../../lib/services/location';
import type { DeliveryZone } from '../../types/settings';

interface LocationSelectorProps {
  onLocationSelected: (location: {
    pincode: string;
    zone: DeliveryZone;
  }) => void;
  onClose: () => void;
}

export function LocationSelector({ onLocationSelected, onClose }: LocationSelectorProps) {
  const [pincode, setPincode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [availableZones, setAvailableZones] = useState<DeliveryZone[]>([]);
  const [error, setError] = useState<string>('');

  const locationService = LocationService.getInstance();

  const handlePincodeValidation = async () => {
    if (!pincode.trim()) {
      setError('Please enter a pincode');
      return;
    }

    if (!locationService.validatePincodeFormat(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const validation = await locationService.validatePincode(pincode);
      console.log('Pincode validation result:', validation);

      if (!validation.available) {
        setError(validation.message);
        setAvailableZones([]);
        return;
      }

      setAvailableZones(validation.zones);

      if (validation.zones.length === 1) {
        // If only one zone is available, select it automatically
        handleZoneSelection(validation.zones[0]);
      }
    } catch (error) {
      console.error('Pincode validation error:', error);
      setError(error instanceof Error ? error.message : 'Unable to validate pincode. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleZoneSelection = (zone: DeliveryZone) => {
    onLocationSelected({
      pincode,
      zone,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-lg shadow-xl md:max-w-md overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Select Delivery Location</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Pincode Input */}
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
              Enter Delivery Pincode
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePincodeValidation();
                  }
                }}
                placeholder="Enter 6-digit pincode"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Check Availability Button */}
          <button
            onClick={handlePincodeValidation}
            disabled={isValidating}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isValidating ? 'Checking...' : 'Check Availability'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Available Zones */}
          {availableZones.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Available Delivery Zones</p>
              {availableZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelection(zone)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:border-blue-500 hover:bg-blue-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{zone.name}</p>
                    <p className="text-sm text-gray-500">
                      Delivery Fee: ₹{zone.base_delivery_fee} • Min Order: ₹{zone.minimum_order}
                    </p>
                    <p className="text-sm text-gray-500">
                      Estimated Time: {zone.estimated_time}
                    </p>
                  </div>
                  <MapPin className="h-5 w-5 text-blue-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 