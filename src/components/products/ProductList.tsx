import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Filter, Check } from 'lucide-react';
import { productService } from '../../lib/services/products';
import { categoryService } from '../../lib/services/categories';
import { useCart } from '../../contexts/CartContext';
import type { Product, Category } from '../../types/product';
import { BottomNav } from '../navigation/BottomNav';

export function ProductList() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId) {
      loadCategoryAndProducts(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedSubCategory]);

  const loadCategoryAndProducts = async (id: string) => {
    try {
      setLoading(true);
      const [categoryData, productsData, subCategoriesData] = await Promise.all([
        categoryService.getCategory(id),
        productService.getProductsByCategory(id),
        categoryService.getCategories()
      ]);

      // Filter sub-categories for current category
      const subs = subCategoriesData.filter(cat => cat.parent_id === id);
      
      setCategory(categoryData);
      setProducts(productsData);
      setSubCategories(subs);
    } catch (error) {
      console.error('Error loading category products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply sub-category filter
    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.sub_category_id === selectedSubCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(product.id);
      await addToCart(product);
      setTimeout(() => setAddingToCart(null), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(null);
    }
  };

  const renderProductCard = (product: Product) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(product.name);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-2xl font-bold text-gray-300">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute top-1 right-1">
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="font-medium text-gray-900 text-xs truncate">{product.name}</h3>
          <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-semibold text-blue-600">₹{product.price.toFixed(2)}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
              }}
              disabled={addingToCart === product.id || product.stock <= 0}
              className={`p-1.5 rounded-full transition-colors ${
                product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : addingToCart === product.id
                  ? 'bg-green-50 text-green-600'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {addingToCart === product.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto bg-white min-h-screen pb-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto bg-white min-h-screen pb-16">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <Link to="/" className="mr-3">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-base font-semibold">{category?.name || 'Products'}</h1>
            </div>
            <button
              onClick={() => {}}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Sub Categories */}
          {subCategories.length > 0 && (
            <div className="px-3 pb-3 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !selectedSubCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {subCategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedSubCategory === sub.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="p-2">
          <div className="grid grid-cols-3 gap-2">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => renderProductCard(product))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}