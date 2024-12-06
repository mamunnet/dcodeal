import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Check, Heart, Share2, Truck, RotateCcw, ChevronDown } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { productService } from '../../lib/services/products';
import type { Product } from '../../types/product';
import { BottomNav } from '../navigation/BottomNav';

interface CartItem extends Product {
  quantity: number;
}

export function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      const cartItem: CartItem = { ...product, quantity };
      await addToCart(cartItem);
      setTimeout(() => setAddingToCart(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      const cartItem: CartItem = { ...product, quantity };
      await addToCart(cartItem);
      navigate('/checkout'); // Navigate to checkout after adding to cart
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
    }
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    const newIndex = (currentImageIndex + 1) % product.images.length;
    setCurrentImageIndex(newIndex);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    const newIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
    setCurrentImageIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen pb-16">
          <div className="animate-pulse">
            <div className="h-14 bg-white border-b border-gray-200"></div>
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen pb-16 p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">Error</h2>
            <p className="mt-2 text-gray-600">{error || 'Product not found'}</p>
            <Link to="/" className="mt-4 inline-block text-blue-600">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen pb-32">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <Link to="/" className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-base font-semibold">Product Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="relative bg-gray-100">
          <div className="aspect-square w-full h-72">
            {product.images && product.images.length > 0 ? (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(product.name);
                  }}
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-300">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Image Navigation */}
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Thumbnails */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 px-2 py-1 bg-white/90 rounded-full">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Title and Price */}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{product.name}</h1>
            <div className="mt-1.5 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-blue-600">₹{product.price.toFixed(2)}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-base text-gray-500 line-through">₹{product.mrp.toFixed(2)}</span>
                  <span className="text-sm font-medium text-green-600">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-3">
            <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 mr-1"></span>
                  {product.stock} in stock
                </>
              ) : (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 mr-1"></span>
                  Out of stock
                </>
              )}
            </span>
            {product.sku && (
              <span className="text-xs text-gray-500">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-2 py-1 text-sm text-gray-900 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="pt-1">
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-900">Description</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform ${
                  showFullDescription ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {showFullDescription && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Delivery Info */}
          <div className="pt-1 space-y-2">
            <div className="flex items-start space-x-2 text-xs">
              <Truck className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p className="text-gray-600">Estimated delivery in 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-xs">
              <RotateCcw className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Easy Returns</p>
                <p className="text-gray-600">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-16 inset-x-0 p-3 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock <= 0}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1 text-sm font-medium transition-colors ${
                product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : addingToCart
                  ? 'bg-green-50 text-green-600'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {addingToCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`py-2 px-3 rounded-lg text-sm font-medium ${
                product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}