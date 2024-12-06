import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Check, Trash, CreditCard } from 'lucide-react'

interface Card {
  id: number
  type: string
  number: string
  expiry: string
  default: boolean
}

interface PaymentSectionProps {
  cards: Card[]
  onBack: () => void
  onAddCard: (card: Omit<Card, 'id'>) => void
  onDeleteCard: (id: number) => void
  onSetDefault: (id: number) => void
}

export function PaymentSection({ cards, onBack, onAddCard, onDeleteCard, onSetDefault }: PaymentSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCard, setNewCard] = useState({
    type: 'visa',
    number: '',
    expiry: '',
    default: false,
  })

  const handleSubmit = () => {
    if (!newCard.number || !newCard.expiry) {
      alert('Please fill in all fields')
      return
    }

    onAddCard(newCard)
    setIsAdding(false)
    setNewCard({
      type: 'visa',
      number: '',
      expiry: '',
      default: false,
    })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

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
          <Plus size={24} className="text-blue-600" />
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
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                maxLength={19}
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="**** **** **** ****"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                maxLength={5}
                value={newCard.expiry}
                onChange={(e) => setNewCard({ ...newCard, expiry: formatExpiry(e.target.value) })}
                className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="default"
                checked={newCard.default}
                onChange={(e) => setNewCard({ ...newCard, default: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="default" className="text-sm text-gray-700">Set as default payment method</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
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
                  <CreditCard className={`h-5 w-5 ${
                    card.type.toLowerCase() === 'visa' ? 'text-blue-600' :
                    card.type.toLowerCase() === 'mastercard' ? 'text-red-600' :
                    'text-gray-600'
                  }`} />
                  <span className="font-medium">{card.type}</span>
                  {card.default && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
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
                      <Check size={20} className="text-blue-600" />
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
              <p className="text-sm text-gray-600">{card.number}</p>
              <p className="text-sm text-gray-600">Expires {card.expiry}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
} 