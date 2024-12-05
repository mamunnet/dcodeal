import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { PersonalInfo } from '../types'

interface PersonalInfoSectionProps {
  info: PersonalInfo
  onBack: () => void
  onSave: (info: PersonalInfo) => void
}

export function PersonalInfoSection({ info, onBack, onSave }: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState(info)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-white p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Personal Information</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(formData)}
          className="w-full bg-green-600 text-white p-4 rounded-2xl font-medium hover:bg-green-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  )
} 