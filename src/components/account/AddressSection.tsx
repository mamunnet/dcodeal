import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Check, Trash } from 'lucide-react'
import type { UserAddress } from '../../lib/services/user'

interface AddressSectionProps {
  addresses: UserAddress[]
  onBack: () => void
  onAddAddress: (address: Omit<UserAddress, 'id'>) => void
  onDeleteAddress: (id: string) => void
  onSetDefault: (id: string) => void
}

export function AddressSection({ addresses, onBack, onAddAddress, onDeleteAddress, onSetDefault }: AddressSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<UserAddress, 'id'>>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAddress(newAddress);
    setShowAddForm(false);
    setNewAddress({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home',
      isDefault: false
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      <header className="p-4 flex items-center gap-3 sticky top-0 z-10 bg-white border-b">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Address Book</h1>
      </header>

      <div className="p-4">
        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Saved Addresses</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-blue-600 text-sm font-medium"
              >
                Add New
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 rounded-lg border-2 border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            address.type === 'home'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {address.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.street}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    {address.isDefault && (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => onSetDefault(address.id)}
                        className="text-sm text-blue-600"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteAddress(address.id)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                PIN Code
              </label>
              <input
                type="text"
                id="pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address Type</label>
              <div className="mt-2 flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={newAddress.type === 'home'}
                    onChange={() => setNewAddress({ ...newAddress, type: 'home' })}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Home</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={newAddress.type === 'work'}
                    onChange={() => setNewAddress({ ...newAddress, type: 'work' })}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Work</span>
                </label>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="max-w-md mx-auto flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Address
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
} 