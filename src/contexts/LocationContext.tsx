import { createContext, useContext, useState, useEffect } from 'react';
import { LocationService } from '../lib/services/location';
import type { DeliveryZone } from '../types/settings';

interface LocationContextType {
  selectedPincode: string | null;
  setPincode: (pincode: string) => Promise<void>;
  clearPincode: () => void;
  isValidating: boolean;
  isAvailable: boolean;
  availableZones: DeliveryZone[];
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedPincode, setSelectedPincode] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableZones, setAvailableZones] = useState<DeliveryZone[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load pincode from localStorage on mount
  useEffect(() => {
    const savedPincode = localStorage.getItem('selectedPincode');
    if (savedPincode) {
      setPincode(savedPincode).catch(console.error);
    }
  }, []);

  const setPincode = async (pincode: string) => {
    setIsValidating(true);
    setError(null);

    try {
      const locationService = LocationService.getInstance();
      const result = await locationService.validatePincode(pincode);

      if (result.available) {
        setSelectedPincode(pincode);
        setIsAvailable(true);
        setAvailableZones(result.zones);
        localStorage.setItem('selectedPincode', pincode);
      } else {
        setIsAvailable(false);
        setAvailableZones([]);
        setError(result.message);
      }
    } catch (error) {
      console.error('Error validating pincode:', error);
      setError('Failed to validate pincode. Please try again.');
      setIsAvailable(false);
      setAvailableZones([]);
    } finally {
      setIsValidating(false);
    }
  };

  const clearPincode = () => {
    setSelectedPincode(null);
    setIsAvailable(false);
    setAvailableZones([]);
    localStorage.removeItem('selectedPincode');
  };

  return (
    <LocationContext.Provider
      value={{
        selectedPincode,
        setPincode,
        clearPincode,
        isValidating,
        isAvailable,
        availableZones,
        error,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 