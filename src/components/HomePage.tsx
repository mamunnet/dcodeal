import { motion } from 'framer-motion'
import { ShoppingCart, MapPin, Search, Bike, Car, Pizza, ShoppingBag, Pill, Dog, Beef, Package, ChevronRight } from 'lucide-react'

export function HomePage() {
  const quickMenuItems = [
    'All', 'Grocery', 'Food', 'Medicines', 'Pet Supplies', 'Fresh Meat',
    'Vegetables', 'Fruits', 'Electronics'
  ]

  const deals = [
    {
      title: '50% OFF',
      description: 'On first 3 orders',
      bgColor: 'bg-gradient-to-r from-violet-500 to-purple-500',
      buttonText: 'Claim Now'
    },
    {
      title: 'Free Delivery',
      description: 'Orders above $30',
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      buttonText: 'Order Now'
    }
  ]

  const categories = [
    { 
      name: 'RIDE', 
      bgColor: 'bg-pink-100', 
      icon: <Bike size={24} className="text-pink-600" />
    },
    { 
      name: 'CABS', 
      bgColor: 'bg-yellow-100', 
      icon: <Car size={24} className="text-yellow-600" />
    },
    { 
      name: 'FOOD', 
      bgColor: 'bg-orange-100', 
      icon: <Pizza size={24} className="text-orange-600" />
    },
    { 
      name: 'GROCERY', 
      bgColor: 'bg-green-100', 
      icon: <ShoppingBag size={24} className="text-green-600" />
    },
    { 
      name: 'MEDICINE', 
      bgColor: 'bg-blue-100', 
      icon: <Pill size={24} className="text-blue-600" />
    },
    { 
      name: 'PET', 
      bgColor: 'bg-purple-100', 
      icon: <Dog size={24} className="text-purple-600" />
    },
    { 
      name: 'MEAT', 
      bgColor: 'bg-red-100', 
      icon: <Beef size={24} className="text-red-600" />
    },
    { 
      name: 'PARCEL', 
      bgColor: 'bg-brown-100', 
      icon: <Package size={24} className="text-amber-800" />
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <MapPin className="text-green-600" size={20} />
          <div className="text-sm">
            <div className="font-semibold">Home</div>
            <div className="text-gray-500 text-xs">B 101, Nirvana Point, Hamilton</div>
          </div>
        </div>
        <div className="relative">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
        </div>
      </motion.header>

      {/* Super Saver Banner */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-4"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white flex justify-between items-center shadow-lg">
          <div>
            <div className="font-bold text-xl">SUPER SAVER</div>
            <div className="mt-1">Delivery & Cab Booking</div>
          </div>
          <div className="h-20 w-20 flex items-center justify-center">
            <Bike size={48} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="px-4 sticky top-16 z-10 pb-2 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items or store"
            className="w-full p-3 pl-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      {/* Quick Menu */}
      <div className="px-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 whitespace-nowrap pb-2">
          {quickMenuItems.map((item) => (
            <button
              key={item}
              className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {categories.map((category) => (
          <motion.div
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className={`w-16 h-16 rounded-lg ${category.bgColor} flex items-center justify-center shadow-sm hover:shadow-md transition-shadow`}>
              {category.icon}
            </div>
            <span className="text-xs mt-1 font-medium">{category.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Deals Section */}
      <div className="py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Deals You Can't Miss</h2>
          <button className="text-green-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="px-4 space-y-3">
          {deals.map((deal, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${deal.bgColor} rounded-xl p-4 flex items-center justify-between overflow-hidden relative shadow-lg group`}
            >
              <div className="text-white z-10">
                <motion.h3 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-2xl font-bold"
                >
                  {deal.title}
                </motion.h3>
                <p className="mt-1 opacity-90 text-sm">{deal.description}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 bg-white text-gray-800 px-6 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all"
                >
                  {deal.buttonText}
                </motion.button>
              </div>
              <motion.div 
                className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-300"
              />
              <motion.div 
                className="absolute right-8 bottom-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 group-hover:scale-110 transition-transform duration-300"
              />
              <motion.div 
                className="absolute left-1/2 top-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instant Delivery Banner */}
      <div className="p-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="font-bold text-xl">Instant Delivery</div>
            <div className="mt-1">Anything, Anywhere</div>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>
    </motion.div>
  )
} 