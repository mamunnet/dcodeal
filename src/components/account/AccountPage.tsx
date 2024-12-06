import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, MapPinned, CreditCard, Clock, Heart, Bell,
  Settings, Shield, HelpCircle, LogOut, ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PersonalInfoSection } from './PersonalInfoSection'
import { AddressSection } from './AddressSection'
import { PaymentSection } from './PaymentSection'
import { userService, type UserAddress } from '../../lib/services/user'
import { Auth } from '../../lib/auth'

interface MenuSection {
  title: string
  items: {
    icon: JSX.Element
    label: string
    info?: string
    onClick?: () => void
  }[]
}

interface PersonalInfo {
  name: string
  email: string
  phone: string
  dob: string
}

interface Card {
  id: number
  type: string
  number: string
  expiry: string
  default: boolean
}

interface AccountPageProps {
  onBack: () => void
}

export function AccountPage({ onBack }: AccountPageProps) {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [cards, setCards] = useState<Card[]>([
    { id: 1, type: 'Visa', number: '**** **** **** 1234', expiry: '12/24', default: true },
    { id: 2, type: 'Mastercard', number: '**** **** **** 5678', expiry: '03/25', default: false },
  ])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    dob: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const profile = await userService.getCurrentUserProfile()
      if (profile) {
        setPersonalInfo({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          dob: '', // Add this field to user service if needed
        })
        setAddresses(profile.addresses)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const auth = Auth.getInstance()
      await auth.logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleUpdatePersonalInfo = async (info: PersonalInfo) => {
    try {
      await userService.updateProfile({
        name: info.name,
        email: info.email,
        phone: info.phone,
      })
      setPersonalInfo(info)
      setCurrentSection(null)
    } catch (error) {
      console.error('Error updating personal info:', error)
    }
  }

  const handleAddAddress = async (address: Omit<UserAddress, 'id'>) => {
    try {
      await userService.addAddress(address)
      await loadUserProfile() // Reload addresses
    } catch (error) {
      console.error('Error adding address:', error)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      await userService.deleteAddress(id)
      await loadUserProfile() // Reload addresses
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await userService.setDefaultAddress(id)
      await loadUserProfile() // Reload addresses
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  const renderSection = () => {
    switch(currentSection) {
      case 'Personal Information':
        return (
          <PersonalInfoSection
            info={personalInfo}
            onBack={() => setCurrentSection(null)}
            onSave={handleUpdatePersonalInfo}
          />
        )
      case 'Address Book':
        return (
          <AddressSection
            addresses={addresses}
            onBack={() => setCurrentSection(null)}
            onAddAddress={handleAddAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefault={handleSetDefaultAddress}
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
        { 
          icon: <Clock className="text-orange-600" size={20} />, 
          label: "Order History", 
          info: "View Orders",
          onClick: () => navigate('/orders')
        },
        { 
          icon: <Heart className="text-red-600" size={20} />, 
          label: "Favorites", 
          info: "Coming Soon" 
        },
        { 
          icon: <Bell className="text-yellow-600" size={20} />, 
          label: "Notifications", 
          info: "On" 
        },
      ]
    },
    {
      title: "Settings & Support",
      items: [
        { 
          icon: <Settings className="text-gray-600" size={20} />, 
          label: "App Settings",
          onClick: () => navigate('/settings')
        },
        { 
          icon: <Shield className="text-indigo-600" size={20} />, 
          label: "Privacy & Security" 
        },
        { 
          icon: <HelpCircle className="text-teal-600" size={20} />, 
          label: "Help & Support" 
        },
        {
          icon: <LogOut className="text-red-600" size={20} />,
          label: "Logout",
          onClick: handleLogout
        }
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 