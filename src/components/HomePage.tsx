import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, MapPin, Search, ChevronRight, X } from 'lucide-react';
import { LocationSelector } from './location/LocationSelector';
import { BottomNav } from './navigation/BottomNav';
import { categoryService } from '../lib/services/categories';
import { productService } from '../lib/services/products';
import { useCart } from '../contexts/CartContext';
import type { DeliveryZone } from '../types/settings';
import type { Category } from '../types/product';
import type { Product } from '../types/product';

export function HomePage() {
  const [showLocationSelector, setShowLocationSelector] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    pincode: string;
    zone: DeliveryZone;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { totalItems } = useCart();

  const deals = [
    {
      title: '50% OFF',
      description: 'On first 3 orders',
      bgColor: 'bg-gradient-to-r from-violet-500 to-purple-500',
      buttonText: 'Claim Now'
    },
    {
      title: 'Free Delivery',
      description: 'Orders above ₹500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      buttonText: 'Order Now'
    }
  ];

  useEffect(() => {
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation));
      setShowLocationSelector(false);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (searchTerm) {
      setIsSearching(true);
      timeoutId = setTimeout(handleSearch, 500);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('Loading categories...');
      const data = await categoryService.getActiveCategories();
      console.log('Categories loaded:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    try {
      const results = await productService.searchProducts(searchTerm);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelected = (location: {
    pincode: string;
    zone: DeliveryZone;
  }) => {
    setSelectedLocation(location);
    setShowLocationSelector(false);
    localStorage.setItem('deliveryLocation', JSON.stringify(location));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="pb-20"
        >
          {/* Header */}
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm"
          >
            <button 
              onClick={() => setShowLocationSelector(true)}
              className="flex items-center gap-2"
            >
              <MapPin className="text-green-600" size={20} />
              <div className="text-sm">
                <div className="font-semibold">Delivery to</div>
                <div className="text-gray-500 text-xs truncate max-w-[200px]">
                  {selectedLocation ? `${selectedLocation.zone.name} - ${selectedLocation.pincode}` : 'Select your location'}
                </div>
              </div>
            </button>
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </motion.header>

          {/* Search Bar */}
          <div className="px-4 sticky top-16 z-20 pb-2 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items or store"
                className="w-full p-3 pl-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Search Results Overlay */}
            {showSearchResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-x-0 top-[8.5rem] bottom-16 z-10 max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-t-xl shadow-lg overflow-hidden"
              >
                <div className="h-full overflow-y-auto">
                  {isSearching ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 flex items-center hover:bg-white/90 cursor-pointer transition-colors"
                        >
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <span className="text-2xl font-bold text-gray-300">
                                  {product.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-grow">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                            <div className="text-sm font-medium text-green-600 mt-1">₹{product.price.toFixed(2)}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-2">No products found</div>
                      <div className="text-sm text-gray-500">Try a different search term</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className={`transition-all duration-300 ${showSearchResults ? 'opacity-30' : 'opacity-100'}`}>
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
                  <ShoppingCart size={48} className="text-white/90" />
                </div>
              </div>
            </motion.div>

            {/* Categories Grid */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Categories</h2>
                <button className="text-green-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              {loading ? (
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="text-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="aspect-square rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-gray-200">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <span className="text-2xl font-bold text-gray-300">
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate px-1">{category.name}</p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
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
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instant Delivery Banner */}
            {selectedLocation && (
              <div className="p-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-lg relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="font-bold text-xl">Instant Delivery</div>
                    <div className="mt-1">
                      {selectedLocation.zone.estimated_time} • Delivery Fee: ₹{selectedLocation.zone.base_delivery_fee}
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Location Selector Modal */}
        {showLocationSelector && (
          <div className="fixed inset-0 z-50">
            <div className="max-w-md mx-auto">
              <LocationSelector
                onLocationSelected={handleLocationSelected}
                onClose={() => setShowLocationSelector(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 