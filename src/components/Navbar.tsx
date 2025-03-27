import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Phone, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { CSSTransition } from 'react-transition-group';
import Button from './Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';
  const shouldUseTransparentBg = isHomePage && !isScrolled;

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      shouldUseTransparentBg ? 'bg-transparent' : 'bg-black'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="transition-transform hover:scale-105 duration-250">
            <Logo 
              variant="light"
              className="transform scale-125"
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/tools"
              className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250"
            >
              Tools
            </Link>
            <a
              href={isHomePage ? '#how-it-works' : '/'}
              className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250"
            >
              How It Works
            </a>
            <Link
              to="/orders"
              className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250 flex items-center gap-2 bg-transparent"
            >
              <ClipboardList className="w-5 h-5" />
              My Orders
            </Link>
            <a
              href="https://wa.me/66933880630"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </a>
            <Button
              to="/basket"
              variant="primary"
              size="md"
              className="relative"
              icon={<ShoppingCart className="w-5 h-5" />}
              iconPosition="left"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden btn-animate"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="text-white" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <CSSTransition
          in={isMobileMenuOpen}
          timeout={prefersReducedMotion ? 0 : 250}
          classNames="menu"
          unmountOnExit
        >
          <div className="md:hidden bg-black shadow-lg rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/tools"
                className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tools
              </Link>
              <a
                href={isHomePage ? '#how-it-works' : '/'}
                className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <Link
                to="/orders"
                className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250 flex items-center gap-2 bg-transparent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ClipboardList className="w-5 h-5" />
                My Orders
              </Link>
              <a
                href="https://wa.me/66933880630"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:text-[#FFF02B] transition-colors duration-250 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </a>
              <Button
                to="/basket"
                variant="primary"
                size="md"
                fullWidth
                className="relative"
                icon={<ShoppingCart className="w-5 h-5" />}
                iconPosition="left"
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CSSTransition>
      </div>
    </nav>
  );
}
