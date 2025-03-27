import React, { useState } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Power Tools', count: 156 },
  { name: 'Hand Tools', count: 94 },
  { name: 'Construction', count: 82 },
  { name: 'Woodworking', count: 73 },
  { name: 'Gardening', count: 45 },
  { name: 'Electrical', count: 38 },
  { name: 'Plumbing', count: 29 },
  { name: 'Painting', count: 24 },
];

const tools = [
  {
    id: 1,
    name: 'Professional Drill Kit',
    brand: 'DeWalt',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80',
    price: 1500,
    rating: 4.8,
    reviews: 127,
    stock: 15,
  },
  {
    id: 2,
    name: 'Circular Saw',
    brand: 'Makita',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80',
    price: 1150,
    rating: 4.7,
    reviews: 98,
    stock: 8,
  },
  {
    id: 3,
    name: 'Heavy Duty Hammer',
    brand: 'Stanley',
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80',
    price: 500,
    rating: 4.9,
    reviews: 156,
    stock: 25,
  },
  {
    id: 4,
    name: 'Cordless Impact Driver',
    brand: 'Milwaukee',
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80',
    price: 1800,
    rating: 4.6,
    reviews: 87,
    stock: 0, // Out of stock
  },
];

interface FeedbackState {
  toolId: number | null;
  type: 'success' | 'error';
  message: string;
}

export default function ToolsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const { addToCart, items } = useCart();

  // Check if a tool is already in the cart
  const isInCart = (toolId: number) => {
    return items.some(item => item.id === toolId);
  };

  const handleAddToCart = (tool: typeof tools[0]) => {
    try {
      // Validate product availability
      if (tool.stock <= 0) {
        setFeedback({
          toolId: tool.id,
          type: 'error',
          message: 'This item is out of stock'
        });
        
        // Clear feedback after 3 seconds
        setTimeout(() => {
          setFeedback(null);
        }, 3000);
        
        return;
      }
      
      // Add to cart
      addToCart({
        id: tool.id,
        name: tool.name,
        brand: tool.brand,
        image: tool.image,
        price: tool.price,
      });
      
      // Show success feedback
      setFeedback({
        toolId: tool.id,
        type: 'success',
        message: 'Added to cart!'
      });
      
      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
      
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error adding to cart:', error);
      
      setFeedback({
        toolId: tool.id,
        type: 'error',
        message: 'Failed to add to cart'
      });
      
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    }
  };

  // Function to render the appropriate button state
  const renderAddToCartButton = (tool: typeof tools[0]) => {
    const inCart = isInCart(tool.id);
    const outOfStock = tool.stock <= 0;
    const showingFeedback = feedback && feedback.toolId === tool.id;
    
    if (outOfStock) {
      return (
        <button
          disabled
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold cursor-not-allowed flex items-center justify-center"
        >
          Out of Stock
        </button>
      );
    }
    
    if (showingFeedback) {
      return (
        <button
          className={`${
            feedback.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          } px-4 py-2 rounded-lg font-bold flex items-center justify-center`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-5 h-5 mr-1" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-1" />
          )}
          {feedback.message}
        </button>
      );
    }
    
    if (inCart) {
      return (
        <Link
          to="/basket"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5 mr-1" />
          View in Cart
        </Link>
      );
    }
    
    return (
      <button
        onClick={() => handleAddToCart(tool)}
        className="bg-[#FFD700] text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-[#FFE44D] transition-colors flex items-center justify-center"
      >
        <ShoppingCart className="w-5 h-5 mr-1" />
        Add to Cart
      </button>
    );
  };

  return (
    <div className="pt-20">
      {/* Search and Filter Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
              <div className="flex items-center space-x-2 border rounded-lg">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg"
                >
                  <span>{category.name}</span>
                  <span className="text-gray-500 text-sm">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="flex-1">
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0 relative' : 'relative'}>
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-48 object-cover"
                    />
                    {tool.stock <= 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                    {tool.stock > 0 && tool.stock < 5 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Low Stock: {tool.stock}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{tool.name}</h3>
                    <p className="text-gray-600 mb-2">{tool.brand}</p>
                    <div className="flex items-center mb-4">
                      <span className="text-[#FFD700] font-bold">{tool.rating}</span>
                      <span className="mx-1">•</span>
                      <span className="text-gray-500">{tool.reviews} reviews</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">฿{tool.price}/day</span>
                      {renderAddToCartButton(tool)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
