import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Check, Trash } from 'lucide-react'
import { Address } from '../types'

interface AddressSectionProps {
  addresses: Address[]
  onBack: () => void
  onAddAddress: (address: Omit<Address, 'id'>) => void
  onDeleteAddress: (id: number) => void
  onSetDefault: (id: number) => void
}

export function AddressSection({ addresses, onBack, onAddAddress, onDeleteAddress, onSetDefault }: AddressSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newAddress, setNewAddress] = useState({ type: '', address: '', default: false })

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Address Book</h1>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Plus size={24} className="text-green-600" />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {isAdding ? (
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Address Type</label>
              <input
                type="text"
                placeholder="Home, Work, etc."
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Full Address</label>
              <textarea
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="default"
                checked={newAddress.default}
                onChange={(e) => setNewAddress({ ...newAddress, default: e.target.checked })}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <label htmlFor="default" className="text-sm text-gray-700">Set as default address</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddAddress(newAddress)
                  setIsAdding(false)
                  setNewAddress({ type: '', address: '', default: false })
                }}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
              >
                Add Address
              </button>
            </div>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-2xl shadow-sm p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.type}</span>
                  {address.default && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!address.default && (
                    <button
                      onClick={() => onSetDefault(address.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Check size={20} className="text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteAddress(address.id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Trash size={20} className="text-red-600" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{address.address}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
} 