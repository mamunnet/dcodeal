import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Check, Trash } from 'lucide-react'
import { Card } from '../types'

interface PaymentSectionProps {
  cards: Card[]
  onBack: () => void
  onAddCard: (card: Omit<Card, 'id'>) => void
  onDeleteCard: (id: number) => void
  onSetDefault: (id: number) => void
}

export function PaymentSection({ cards, onBack, onAddCard, onDeleteCard, onSetDefault }: PaymentSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCard, setNewCard] = useState({ type: '', number: '', expiry: '', default: false })

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
          <h1 className="text-xl font-bold">Payment Methods</h1>
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
              <label className="text-sm font-medium text-gray-700">Card Type</label>
              <select
                value={newCard.type}
                onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select card type</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                placeholder="**** **** **** ****"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={newCard.expiry}
                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultCard"
                checked={newCard.default}
                onChange={(e) => setNewCard({ ...newCard, default: e.target.checked })}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <label htmlFor="defaultCard" className="text-sm text-gray-700">Set as default card</label>
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
                  onAddCard(newCard)
                  setIsAdding(false)
                  setNewCard({ type: '', number: '', expiry: '', default: false })
                }}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
              >
                Add Card
              </button>
            </div>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-sm p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{card.type}</span>
                  {card.default && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!card.default && (
                    <button
                      onClick={() => onSetDefault(card.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Check size={20} className="text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteCard(card.id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Trash size={20} className="text-red-600" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{card.number}</p>
              <p className="text-sm text-gray-500">Expires: {card.expiry}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
} 