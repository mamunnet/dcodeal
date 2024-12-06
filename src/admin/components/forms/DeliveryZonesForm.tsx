import { useState } from 'react';
import { MapPin, Plus, Trash } from 'lucide-react';
import type { DeliveryZone } from '../../../types/settings';

interface DeliveryZonesFormProps {
  zones: DeliveryZone[];
  onChange: (zones: DeliveryZone[]) => void;
}

export function DeliveryZonesForm({ zones, onChange }: DeliveryZonesFormProps) {
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);

  const handleAddZone = () => {
    const newZone: DeliveryZone = {
      id: crypto.randomUUID(),
      name: '',
      pincode: '',
      postal_codes: [],
      base_delivery_fee: 0,
      minimum_order: 0,
      estimated_time: '',
      is_active: true,
      active: true
    };
    onChange([...zones, newZone]);
    setSelectedZone(newZone);
  };

  const handleUpdateZone = (updatedZone: DeliveryZone) => {
    const updatedZones = zones.map((zone) =>
      zone.id === updatedZone.id ? updatedZone : zone
    );
    onChange(updatedZones);
    setSelectedZone(updatedZone);
  };

  const handleDeleteZone = (zoneId: string) => {
    onChange(zones.filter((zone) => zone.id !== zoneId));
    if (selectedZone?.id === zoneId) {
      setSelectedZone(null);
    }
  };

  const handleAddPostalCode = (zone: DeliveryZone, postalCode: string) => {
    if (!postalCode.match(/^\d{6}$/)) {
      alert('Please enter a valid 6-digit postal code');
      return;
    }
    if (zone.postal_codes.includes(postalCode)) {
      alert('This postal code is already added');
      return;
    }
    handleUpdateZone({
      ...zone,
      postal_codes: [...zone.postal_codes, postalCode],
    });
  };

  const handleRemovePostalCode = (zone: DeliveryZone, postalCode: string) => {
    handleUpdateZone({
      ...zone,
      postal_codes: zone.postal_codes.filter((code) => code !== postalCode),
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddZone}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Add Delivery Zone
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Zones List */}
        <div className="space-y-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedZone?.id === zone.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{zone.name || 'Unnamed Zone'}</h4>
                    <p className="text-sm text-gray-500">
                      {zone.postal_codes.length} postal codes
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteZone(zone.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Zone Details */}
        {selectedZone && (
          <div className="lg:col-span-2 space-y-6 bg-white p-6 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Zone Name</label>
              <input
                type="text"
                value={selectedZone.name}
                onChange={(e) =>
                  handleUpdateZone({ ...selectedZone, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Base Delivery Fee (₹)</label>
              <input
                type="number"
                value={selectedZone.base_delivery_fee}
                onChange={(e) =>
                  handleUpdateZone({
                    ...selectedZone,
                    base_delivery_fee: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={selectedZone.minimum_order}
                onChange={(e) =>
                  handleUpdateZone({
                    ...selectedZone,
                    minimum_order: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Delivery Time</label>
              <input
                type="text"
                value={selectedZone.estimated_time}
                onChange={(e) =>
                  handleUpdateZone({
                    ...selectedZone,
                    estimated_time: e.target.value,
                  })
                }
                placeholder="e.g. 30-45 minutes"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Active</label>
              <input
                type="checkbox"
                checked={selectedZone.active}
                onChange={(e) =>
                  handleUpdateZone({
                    ...selectedZone,
                    active: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Codes</label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit postal code"
                    maxLength={6}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAddPostalCode(selectedZone, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.postal_codes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md"
                    >
                      <span className="text-sm">{code}</span>
                      <button
                        onClick={() => handleRemovePostalCode(selectedZone, code)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 