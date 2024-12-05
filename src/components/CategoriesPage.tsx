import { motion } from 'framer-motion'
import { ArrowLeft, Pizza, ShoppingBag, Beef, Bike, Car, Pill, Dog, Package } from 'lucide-react'

interface CategoriesPageProps {
  onBack: () => void
}

export function CategoriesPage({ onBack }: CategoriesPageProps) {
  const categoryGroups = [
    {
      title: "Food & Beverages",
      items: [
        { name: 'Restaurants', icon: <Pizza size={24} className="text-orange-600" />, bgColor: 'bg-orange-100' },
        { name: 'Grocery', icon: <ShoppingBag size={24} className="text-green-600" />, bgColor: 'bg-green-100' },
        { name: 'Meat', icon: <Beef size={24} className="text-red-600" />, bgColor: 'bg-red-100' },
      ]
    },
    {
      title: "Transport",
      items: [
        { name: 'Bike Ride', icon: <Bike size={24} className="text-pink-600" />, bgColor: 'bg-pink-100' },
        { name: 'Cab Service', icon: <Car size={24} className="text-yellow-600" />, bgColor: 'bg-yellow-100' },
      ]
    },
    {
      title: "Healthcare",
      items: [
        { name: 'Medicines', icon: <Pill size={24} className="text-blue-600" />, bgColor: 'bg-blue-100' },
        { name: 'Pet Care', icon: <Dog size={24} className="text-purple-600" />, bgColor: 'bg-purple-100' },
      ]
    },
    {
      title: "Services",
      items: [
        { name: 'Parcel', icon: <Package size={24} className="text-amber-800" />, bgColor: 'bg-brown-100' },
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-gray-50 pb-16"
    >
      {/* Header */}
      <header className="bg-white p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">All Categories</h1>
      </header>

      {/* Categories Groups */}
      <div className="p-4 space-y-6">
        {categoryGroups.map((group, index) => (
          <div key={index} className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800">{group.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {group.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-20 h-20 rounded-lg ${item.bgColor} flex items-center justify-center shadow-sm hover:shadow-md transition-shadow`}>
                    {item.icon}
                  </div>
                  <span className="text-sm mt-2 font-medium text-center">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
} 