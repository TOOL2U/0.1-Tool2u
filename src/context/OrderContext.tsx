import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './CartContext';
import { webhookService } from '../utils/webhookService';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'delivered' | 'completed' | 'payment_verification';
  orderDate: string;
  customerInfo: CustomerInfo;
  deliveryTime: string;
  estimatedDelivery?: string;
  paymentVerified?: boolean;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  verifyPayment: (id: string) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    // Calculate estimated delivery date (3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    
    // Determine initial status based on payment method
    const initialStatus = orderData.paymentMethod === 'cod' 
      ? 'processing' 
      : 'payment_verification';
    
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      orderDate: new Date().toISOString(),
      status: initialStatus,
      estimatedDelivery: deliveryDate.toISOString(),
      paymentVerified: orderData.paymentMethod === 'cod' // COD is automatically verified
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Send webhook notification for new order
    try {
      await webhookService.sendOrderWebhook(newOrder);
      console.log('Order webhook sent successfully');
    } catch (error) {
      console.error('Failed to send order webhook:', error);
      // Continue with order creation even if webhook fails
    }
    
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    let updatedOrder: Order | undefined;
    
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === id) {
          updatedOrder = { ...order, status };
          return updatedOrder;
        }
        return order;
      });
      return newOrders;
    });
    
    // If status is changed to completed, send webhook notification
    if (status === 'completed' && updatedOrder) {
      try {
        await webhookService.sendOrderWebhook(updatedOrder);
        console.log('Order completion webhook sent successfully');
      } catch (error) {
        console.error('Failed to send order completion webhook:', error);
      }
    }
  };

  const verifyPayment = async (id: string) => {
    let updatedOrder: Order | undefined;
    
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === id) {
          updatedOrder = { 
            ...order, 
            status: 'processing', 
            paymentVerified: true 
          };
          return updatedOrder;
        }
        return order;
      });
      return newOrders;
    });
    
    // Send webhook notification for payment verification
    if (updatedOrder) {
      try {
        await webhookService.sendOrderWebhook(updatedOrder);
        console.log('Payment verification webhook sent successfully');
      } catch (error) {
        console.error('Failed to send payment verification webhook:', error);
      }
    }
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus, 
      verifyPayment,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
