import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import BasketPage from './pages/BasketPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import ChatBot from './components/ChatBot';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  return (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <PageTransition>
            <div key={location.pathname} className="page-container">
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/basket" element={<BasketPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Routes>
            </div>
          </PageTransition>
          <ChatBot />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;
