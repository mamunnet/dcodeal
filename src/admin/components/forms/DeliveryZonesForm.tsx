import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { DeliveryZone } from '../../../lib/services/settings';

interface DeliveryZonesFormProps {
  zones: DeliveryZone[];
  onSave: (zones: DeliveryZone[]) => Promise<void>;
  onCancel: () => void;
}

export function DeliveryZonesForm({ zones, onSave, onCancel }: DeliveryZonesFormProps) {
  const [editedZones, setEditedZones] = useState<DeliveryZone[]>(zones);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddZone = () => {
    const newZone: DeliveryZone = {
      id: `zone_${Date.now()}`,
      name: '',
      minAmount: 0,
      deliveryFee: 0,
      active: true
    };
    setEditedZones([...editedZones, newZone]);
  };

  const handleRemoveZone = (id: string) => {
    setEditedZones(editedZones.filter(zone => zone.id !== id));
  };

  const handleZoneChange = (id: string, field: keyof DeliveryZone, value: any) => {
    setEditedZones(zones =>
      zones.map(zone =>
        zone.id === id
          ? { ...zone, [field]: value }
          : zone
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate zones
    const invalidZone = editedZones.find(zone => !zone.name || zone.minAmount < 0 || zone.deliveryFee < 0);
    if (invalidZone) {
      setError('Please fill in all fields correctly. Amounts cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(editedZones);
    } catch (error) {
      console.error('Error saving delivery zones:', error);
      setError(error instanceof Error ? error.message : 'Failed to save delivery zones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Delivery Zones</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {editedZones.map((zone, index) => (
          <div key={zone.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">Zone {index + 1}</h3>
              <button
                type="button"
                onClick={() => handleRemoveZone(zone.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) => handleZoneChange(zone.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  value={zone.minAmount}
                  onChange={(e) => handleZoneChange(zone.id, 'minAmount', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Fee
                </label>
                <input
                  type="number"
                  value={zone.deliveryFee}
                  onChange={(e) => handleZoneChange(zone.id, 'deliveryFee', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={zone.active}
                  onChange={(e) => handleZoneChange(zone.id, 'active', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddZone}
        className="mb-6 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add Zone
      </button>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
} 