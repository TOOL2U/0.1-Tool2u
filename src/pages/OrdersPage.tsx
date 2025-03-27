import React, { useState } from 'react';
import { useOrders, Order } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, Truck, AlertTriangle, Search, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  // Function to mark an order as completed (for demo purposes)
  const markAsCompleted = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Mark this order as completed?')) {
      await updateOrderStatus(orderId, 'completed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'payment_verification':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'payment_verification':
        return 'Awaiting Payment Verification';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`;
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (orders.length === 0) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Browse our tools and start renting!
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

  // Order detail view
  if (selectedOrder) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">Order {selectedOrder.id}</h1>
                  <p className="text-gray-500">Placed on {formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                  {getStatusIcon(selectedOrder.status)}
                  <span className="capitalize font-medium">
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>
              
              {selectedOrder.status === 'payment_verification' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your payment is being verified. We'll process your order as soon as verification is complete.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Information</h3>
                  <p className="text-gray-600">{selectedOrder.customerInfo.name}</p>
                  <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
                  <p className="text-gray-600">{selectedOrder.customerInfo.phone}</p>
                  <p className="text-gray-600">{selectedOrder.customerInfo.email}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Details</h3>
                  <p className="text-gray-600">Preferred Time: {selectedOrder.deliveryTime}</p>
                  {selectedOrder.estimatedDelivery && (
                    <p className="text-gray-600">Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Payment Information</h3>
                  <p className="text-gray-600">Method: {selectedOrder.paymentMethod}</p>
                  <p className="text-gray-600">Status: {selectedOrder.paymentVerified ? 'Verified' : 'Pending Verification'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-500 text-sm">{item.brand}</p>
                      <p className="text-sm text-gray-600">Rental Period: {item.days} day{item.days > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)} × {item.quantity}</p>
                      <p className="font-bold">{formatCurrency(item.price * item.quantity * item.days)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax (7%):</span>
                <span>{formatCurrency(selectedOrder.totalAmount * 0.07)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery Fee:</span>
                <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(selectedOrder.totalAmount + (selectedOrder.totalAmount * 0.07) + selectedOrder.deliveryFee)}</span>
              </div>
            </div>
            
            <div className="p-6 border-t">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer support.
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://wa.me/66933880630" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#FFD700] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-[#FFE44D] transition-colors inline-block"
                >
                  Contact Support
                </a>
                
                {/* Demo button to mark order as completed (for testing webhook) */}
                {selectedOrder.status !== 'completed' && (
                  <button 
                    onClick={(e) => markAsCompleted(selectedOrder.id, e)}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors inline-block"
                  >
                    Mark as Completed (Demo)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by ID or name..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found matching your search.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrders.includes(order.id);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div 
                    className="p-6 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold">{order.id}</h2>
                          {order.status === 'payment_verification' && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Awaiting Payment
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500">Ordered on {formatDate(order.orderDate)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                          {getStatusIcon(order.status)}
                          <span className="capitalize font-medium hidden sm:inline">
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <>
                      <div className="p-6 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Delivery Address:</p>
                            <p className="font-medium">{order.deliveryAddress}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Payment Method:</p>
                            <p className="font-medium">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Delivery Time:</p>
                            <p className="font-medium">{order.deliveryTime}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-gray-500 text-sm">{item.brand}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(item.price)} × {item.quantity}</p>
                                <p className="text-sm text-gray-600">for {item.days} day{item.days > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Delivery Fee:</span>
                          <span>{formatCurrency(order.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>{formatCurrency(order.totalAmount + order.deliveryFee)}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 flex justify-between border-t">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Order Details
                        </button>
                        
                        <div className="flex gap-3">
                          {order.status !== 'completed' && (
                            <button
                              onClick={(e) => markAsCompleted(order.id, e)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Mark as Completed (Demo)
                            </button>
                          )}
                          
                          <a 
                            href="https://wa.me/66933880630" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Contact Support
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
