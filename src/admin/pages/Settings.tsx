import { useState, useEffect } from 'react';
import { Save, Store, Truck, CreditCard, Mail, MapPin } from 'lucide-react';
import { settingsService, type Settings, type DeliveryZone } from '../../lib/services/settings';
import { DeliveryZonesForm } from '../components/forms/DeliveryZonesForm';

export default function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeliveryZones, setShowDeliveryZones] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.loadSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setLoading(true);
      setError(null);
      await settingsService.saveSettings(settings);
      // Reload settings to get the latest data
      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryZonesUpdate = async (zones: DeliveryZone[]) => {
    try {
      setLoading(true);
      setError(null);
      await settingsService.updateDeliveryZones(zones);
      await loadSettings();
      setShowDeliveryZones(false);
    } catch (error) {
      console.error('Error updating delivery zones:', error);
      setError(error instanceof Error ? error.message : 'Failed to update delivery zones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p>Error: {error}</p>
        <button
          onClick={loadSettings}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Store Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Store Address</h2>
          </div>
          <div>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Delivery Zones</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDeliveryZones(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Manage Zones
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.deliveryZones.map((zone) => (
              <div
                key={zone.id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <h3 className="font-medium">{zone.name}</h3>
                <p className="text-sm text-gray-600">
                  Min Amount: {settings.currency}{zone.minAmount}
                </p>
                <p className="text-sm text-gray-600">
                  Delivery Fee: {settings.currency}{zone.deliveryFee}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {zone.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </form>

      {/* Delivery Zones Modal */}
      {showDeliveryZones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DeliveryZonesForm
              zones={settings.deliveryZones}
              onSave={handleDeliveryZonesUpdate}
              onCancel={() => setShowDeliveryZones(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 