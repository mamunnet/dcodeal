import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, MapPinned, CreditCard, Clock, Heart, Bell,
  Settings, Shield, HelpCircle, LogOut, ArrowLeft
} from 'lucide-react'
import { PersonalInfoSection } from './PersonalInfoSection'
import { AddressSection } from './AddressSection'
import { PaymentSection } from './PaymentSection'
import { MenuSection, PersonalInfo, Address, Card } from '../types'

interface AccountPageProps {
  onBack: () => void
}

export function AccountPage({ onBack }: AccountPageProps) {
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, type: 'Home', address: '123 Main St, New York, NY 10001', default: true },
    { id: 2, type: 'Work', address: '456 Office Ave, New York, NY 10002', default: false },
  ])

  const [cards, setCards] = useState<Card[]>([
    { id: 1, type: 'Visa', number: '**** **** **** 1234', expiry: '12/24', default: true },
    { id: 2, type: 'Mastercard', number: '**** **** **** 5678', expiry: '03/25', default: false },
  ])

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dob: '1990-01-01',
  })

  const renderSection = () => {
    switch(currentSection) {
      case 'Personal Information':
        return (
          <PersonalInfoSection
            info={personalInfo}
            onBack={() => setCurrentSection(null)}
            onSave={(info) => {
              setPersonalInfo(info)
              setCurrentSection(null)
            }}
          />
        )
      case 'Address Book':
        return (
          <AddressSection
            addresses={addresses}
            onBack={() => setCurrentSection(null)}
            onAddAddress={(address) => {
              setAddresses([...addresses, { ...address, id: addresses.length + 1 }])
            }}
            onDeleteAddress={(id) => {
              setAddresses(addresses.filter(a => a.id !== id))
            }}
            onSetDefault={(id) => {
              setAddresses(addresses.map(a => ({
                ...a,
                default: a.id === id
              })))
            }}
          />
        )
      case 'Payment Methods':
        return (
          <PaymentSection
            cards={cards}
            onBack={() => setCurrentSection(null)}
            onAddCard={(card) => {
              setCards([...cards, { ...card, id: cards.length + 1 }])
            }}
            onDeleteCard={(id) => {
              setCards(cards.filter(c => c.id !== id))
            }}
            onSetDefault={(id) => {
              setCards(cards.map(c => ({
                ...c,
                default: c.id === id
              })))
            }}
          />
        )
      default:
        return null
    }
  }

  const menuSections: MenuSection[] = [
    {
      title: "Profile",
      items: [
        { 
          icon: <User className="text-blue-600" size={20} />, 
          label: "Personal Information", 
          info: personalInfo.name,
          onClick: () => setCurrentSection("Personal Information")
        },
        { 
          icon: <MapPinned className="text-green-600" size={20} />, 
          label: "Address Book", 
          info: `${addresses.length} Addresses`,
          onClick: () => setCurrentSection("Address Book")
        },
        { 
          icon: <CreditCard className="text-purple-600" size={20} />, 
          label: "Payment Methods", 
          info: `${cards.length} Cards`,
          onClick: () => setCurrentSection("Payment Methods")
        },
      ]
    },
    {
      title: "Activity",
      items: [
        { icon: <Clock className="text-orange-600" size={20} />, label: "Order History", info: "12 Orders" },
        { icon: <Heart className="text-red-600" size={20} />, label: "Favorites", info: "8 Items" },
        { icon: <Bell className="text-yellow-600" size={20} />, label: "Notifications", info: "On" },
      ]
    },
    {
      title: "Settings & Support",
      items: [
        { icon: <Settings className="text-gray-600" size={20} />, label: "App Settings" },
        { icon: <Shield className="text-indigo-600" size={20} />, label: "Privacy & Security" },
        { icon: <HelpCircle className="text-teal-600" size={20} />, label: "Help & Support" },
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-gray-50"
    >
      <AnimatePresence mode="wait">
        {currentSection ? (
          renderSection()
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <header className="p-4 flex items-center gap-3">
                <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10">
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Profile</h1>
              </header>
              
              <div className="px-4 pb-6 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={40} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{personalInfo.name}</h2>
                    <p className="opacity-90">{personalInfo.phone}</p>
                    <p className="text-sm opacity-75">{personalInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="p-4 space-y-6">
              {menuSections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {section.items.map((item, itemIndex) => (
                      <motion.button
                        key={itemIndex}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors
                          ${itemIndex !== 0 ? 'border-t border-gray-100' : ''}`}
                        onClick={item.onClick}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          {item.info && (
                            <div className="text-sm text-gray-500">{item.info}</div>
                          )}
                        </div>
                        <ArrowLeft size={20} className="text-gray-400 rotate-180" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Logout Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-2xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <LogOut size={20} className="text-red-600" />
                </div>
                <span className="font-medium">Log Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 