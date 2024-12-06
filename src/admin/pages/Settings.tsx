import { useState, useEffect } from 'react';
import { Save, Store, Truck, CreditCard, Mail, MapPin } from 'lucide-react';
import { SettingsService } from '../../lib/services/settings';
import type { StoreSettings, DeliveryZone } from '../../types/settings';
import { DeliveryZonesForm } from '../components/forms/DeliveryZonesForm';

export default function Settings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const settingsService = SettingsService.getInstance();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setMessage({ type: 'info', text: 'Saving changes...' });
      await settingsService.updateSettings(settings);
      setMessage({
        type: 'success',
        text: 'Settings updated successfully',
      });

      // Reload settings to ensure we have the latest data
      const updatedSettings = await settingsService.getSettings();
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update settings',
      });
    }
  };

  const handleChange = (section: keyof StoreSettings, field: string, value: string | number | boolean | DeliveryZone[]) => {
    if (!settings) return;

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center text-red-600">
        Failed to load settings. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your store settings and preferences
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Store className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Store Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store.name}
                onChange={(e) => handleChange('store', 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Description
              </label>
              <textarea
                value={settings.store.description}
                onChange={(e) => handleChange('store', 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm">
                INR (₹) - Indian Rupee
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.store.contact_email}
                onChange={(e) => handleChange('store', 'contact_email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Truck className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Shipping Settings</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Shipping Rate
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  value={settings.shipping.default_rate}
                  onChange={(e) => handleChange('shipping', 'default_rate', parseFloat(e.target.value))}
                  className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Free Shipping Threshold
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  value={settings.shipping.free_shipping_threshold}
                  onChange={(e) => handleChange('shipping', 'free_shipping_threshold', parseFloat(e.target.value))}
                  className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.shipping.enable_international}
                    onChange={(e) => handleChange('shipping', 'enable_international', e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">
                    Enable International Shipping
                  </label>
                  <p className="text-gray-500">Allow shipping to international addresses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Delivery Zones</h3>
          </div>
          <DeliveryZonesForm
            zones={settings.shipping.delivery_zones}
            onChange={(zones) => handleChange('shipping', 'delivery_zones', zones)}
          />
        </div>

        {/* Payment Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Gateway
              </label>
              <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm">
                Razorpay
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.payment.test_mode}
                    onChange={(e) => handleChange('payment', 'test_mode', e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Test Mode</label>
                  <p className="text-gray-500">Use test credentials for payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.order_confirmation}
                    onChange={(e) => handleChange('notifications', 'order_confirmation', e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">
                    Order Confirmation
                  </label>
                  <p className="text-gray-500">Send email notifications for new orders</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.shipping_updates}
                    onChange={(e) => handleChange('notifications', 'shipping_updates', e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">
                    Shipping Updates
                  </label>
                  <p className="text-gray-500">Send email notifications for shipping status changes</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.notifications.marketing_emails}
                    onChange={(e) => handleChange('notifications', 'marketing_emails', e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">
                    Marketing Emails
                  </label>
                  <p className="text-gray-500">Send promotional emails and newsletters</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
} 