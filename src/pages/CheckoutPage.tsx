import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Lock, MapPin, Loader2, ArrowLeft, Wallet, Building2, QrCode, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, totalItems } = useCart();
  const { addOrder } = useOrders();
  
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/basket');
    }
  }, [items, navigate]);

  const deliveryTimeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00'
  ];

  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity * item.days), 0);
  const deliveryFee = 500;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + deliveryFee + tax;

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!selectedDeliveryTime) {
      alert('Please select a delivery time slot');
      return false;
    }
    
    if (!paymentMethod) {
      alert('Please select a payment method');
      return false;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      setShowTerms(true);
    }
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
    processOrder();
  };

  const processOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Create the order object
      const order = {
        items: [...items],
        totalAmount: subtotal,
        deliveryFee,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        paymentMethod,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        deliveryTime: selectedDeliveryTime
      };
      
      // Add order to context (this will also trigger the webhook)
      const newOrder = await addOrder(order);
      
      // Clear the cart
      clearCart();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to order confirmation
      navigate(`/orders`);
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationFind = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        setFormData(prev => ({
          ...prev,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
        
        setIsLocating(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] pl-10"
                  placeholder="1234 5678 9012 3456"
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] pl-10"
                    placeholder="MM/YY"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] pl-10"
                    placeholder="123"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Note:</span> Your payment will require verification by our team before your order is processed.
              </p>
            </div>
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Bank Transfer Details</span>
            </div>
            <div className="space-y-2">
              <p><strong>Bank:</strong> Bangkok Bank</p>
              <p><strong>Account Name:</strong> Tool2U Co., Ltd.</p>
              <p><strong>Account Number:</strong> 731-0-146746</p>
            </div>
            <p className="text-sm text-gray-600">
              Please transfer the exact amount and send us the transfer slip through WhatsApp for faster verification.
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Note:</span> Your order will be processed after we verify your payment.
              </p>
            </div>
          </div>
        );
      case 'promptpay':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg text-center">
            <QrCode className="w-8 h-8 mx-auto text-gray-600" />
            <img 
              src="https://imgur.com/f6f79fe8-3977-4cbf-b1e9-4895ebf7e805" 
              alt="PromptPay QR Code"
              className="max-w-[200px] mx-auto"
            />
            <p className="text-sm text-gray-600">
              Scan this QR code with your banking app to pay via PromptPay
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Note:</span> Your order will be processed after we verify your payment.
              </p>
            </div>
          </div>
        );
      case 'cod':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <p className="text-sm text-gray-600">
              Pay in cash when your tools are delivered. Please prepare the exact amount.
            </p>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Note:</span> Cash on Delivery orders are processed immediately without payment verification.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (items.length === 0) {
    return <div className="pt-20 text-center">Loading...</div>;
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link
            to="/basket"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1">
            {/* Delivery Information */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                      formErrors.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                      formErrors.lastName ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                      formErrors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                      formErrors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., 0933880630"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                        formErrors.address ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      onClick={handleLocationFind}
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FFD700] text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-[#FFE44D] transition-colors flex items-center gap-2"
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Locating...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>Find My Location</span>
                        </>
                      )}
                    </button>
                  </div>
                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                  )}
                  {locationError && (
                    <p className="mt-1 text-sm text-red-600">{locationError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                      formErrors.city ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                      formErrors.postalCode ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Delivery Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDeliveryTime}
                    onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  >
                    <option value="">Select a time slot</option>
                    {deliveryTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {!selectedDeliveryTime && (
                    <p className="mt-1 text-sm text-red-600">Please select a delivery time</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Method <span className="text-red-500">*</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  type="button"
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'card' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'bank' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <Building2 className="w-6 h-6" />
                  <span>Bank Transfer</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'promptpay' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('promptpay')}
                >
                  <QrCode className="w-6 h-6" />
                  <span>PromptPay</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'cod' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <Wallet className="w-6 h-6" />
                  <span>Cash on Delivery</span>
                </button>
              </div>
              
              {/* Payment Method Form */}
              <div className="mt-6">
                {renderPaymentForm()}
              </div>
              
              {!paymentMethod && (
                <p className="mt-2 text-sm text-red-600">Please select a payment method</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">
                          ฿{item.price.toLocaleString()} × {item.quantity} × {item.days} day{item.days > 1 ? 's' : ''}
                        </span>
                        <span className="font-medium">
                          ฿{(item.price * item.quantity * item.days).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span>฿{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>฿{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>฿{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-[#FFD700] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-[#FFE44D] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
              
              <Link
                to="/tools"
                className="w-full mt-4 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors block text-center"
              >
                Continue Shopping
              </Link>
              
              <div className="mt-6 text-sm text-gray-500 space-y-2">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Your payment information is secure and encrypted</p>
                </div>
                {paymentMethod && paymentMethod !== 'cod' && (
                  <div className="flex items-start gap-2 text-yellow-700 bg-yellow-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Orders will be processed after payment verification</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
              <div className="prose prose-sm">
                <h3 className="text-xl font-bold">TOOL2U TERMS AND CONDITIONS</h3>
                
                <h4 className="font-bold mt-4">1. Introduction</h4>
                <p>Welcome to Tool2U! These Terms and Conditions govern your use of our tool rental services, including rental agreements, payments, deposits, delivery, and returns. By using our service, you agree to comply with these terms.</p>

                <h4 className="font-bold mt-4">2. Rental Eligibility</h4>
                <ul className="list-disc pl-5">
                  <li>Customers must be at least 18 years old to rent tools.</li>
                  <li>A valid government-issued ID and a payment method are required.</li>
                  <li>Tool2U reserves the right to refuse service at our discretion.</li>
                </ul>

                <h4 className="font-bold mt-4">3. Rental Period & Extensions</h4>
                <ul className="list-disc pl-5">
                  <li>Rental duration is selected at checkout and starts from the time of delivery.</li>
                  <li>Extensions must be requested before the due date and are subject to availability.</li>
                  <li>Late returns will incur additional charges.</li>
                </ul>

                <h4 className="font-bold mt-4">4. Payments & Deposits</h4>
                <ul className="list-disc pl-5">
                  <li>All rentals require full prepayment at checkout.</li>
                  <li>A refundable security deposit may be required, which will be held on the customer's card or collected in cash.</li>
                  <li>Deposits are refunded upon tool return, subject to damage inspection.</li>
                </ul>

                <h4 className="font-bold mt-4">5. Delivery & Pickup</h4>
                <ul className="list-disc pl-5">
                  <li>Tools will be delivered to the address provided by the customer.</li>
                  <li>The customer must be available to receive the delivery or arrange for an authorized recipient.</li>
                  <li>Pickup must be scheduled in advance, and tools should be ready for return at the agreed time.</li>
                </ul>

                <h4 className="font-bold mt-4">6. Tool Usage & Responsibility</h4>
                <ul className="list-disc pl-5">
                  <li>Customers are responsible for using tools safely and in accordance with manufacturer guidelines.</li>
                  <li>Tools must not be used for illegal activities or modified in any way.</li>
                  <li>Customers must ensure tools are returned in the same condition as received.</li>
                </ul>

                <h4 className="font-bold mt-4">7. Late Fees & Penalties</h4>
                <ul className="list-disc pl-5">
                  <li>A late fee of ฿500 per day applies for overdue rentals.</li>
                  <li>If a rental exceeds 2 days without return, Tool2U reserves the right to charge the customer's payment method for the full replacement cost.</li>
                </ul>

                <h4 className="font-bold mt-4">8. Damages & Liability</h4>
                <ul className="list-disc pl-5">
                  <li>Customers are responsible for damages beyond normal wear and tear.</li>
                  <li>If a tool is damaged, Tool2U will assess repair costs and deduct them from the deposit or charge the customer accordingly.</li>
                  <li>Lost or stolen tools will be charged at full replacement value.</li>
                </ul>

                <h4 className="font-bold mt-4">9. Cancellations & Refunds</h4>
                <ul className="list-disc pl-5">
                  <li>Cancellations made at least 2 hours before the scheduled delivery are eligible for a full refund.</li>
                  <li>Cancellations after this period may be subject to a cancellation fee.</li>
                  <li>No refunds are issued once the rental period begins.</li>
                </ul>

                <h4 className="font-bold mt-4">10. Dispute Resolution</h4>
                <ul className="list-disc pl-5">
                  <li>Any disputes regarding charges, damages, or terms must be raised within 7 days of rental return.</li>
                  <li>Tool2U reserves the right to make final decisions on disputes.</li>
                </ul>

                <h4 className="font-bold mt-4">11. Changes to Terms</h4>
                <ul className="list-disc pl-5">
                  <li>Tool2U may update these Terms and Conditions at any time. Customers will be notified of significant changes.</li>
                </ul>

                <h4 className="font-bold mt-4">12. Contact Information</h4>
                <p>For any inquiries or support, contact us at Shaunducker1@gmail.com or 0933880630.</p>

                <p className="mt-4 font-bold">By using Tool2U's services, you acknowledge and agree to these Terms and Conditions.</p>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptTerms}
                  className="px-4 py-2 bg-[#FFD700] text-gray-900 rounded-lg font-bold hover:bg-[#FFE44D]"
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
