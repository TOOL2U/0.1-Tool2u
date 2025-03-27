import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function BasketPage() {
  const { items, removeFromCart, updateQuantity, updateDays } = useCart();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.days * item.quantity), 0);
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleDaysChange = (id: number, days: number) => {
    updateDays(id, days);
  };

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Your Basket</h1>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your basket is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any tools to your basket yet.
            </p>
            <Link
              to="/tools"
              className="bg-[#FFD700] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-[#FFE44D] transition-colors inline-block"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Basket</h1>
          <Link
            to="/tools"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items List */}
          <div className="flex-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-gray-600">{item.brand}</p>
                  <p className="text-lg font-bold mt-2">฿{item.price}/day</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.days}
                      onChange={(e) => handleDaysChange(item.id, parseInt(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <option key={day} value={day}>
                          {day} {day === 1 ? 'day' : 'days'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>฿{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>฿{deliveryFee}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>฿{total}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-[#FFD700] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-[#FFE44D] transition-colors block text-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/tools"
                className="w-full mt-4 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
