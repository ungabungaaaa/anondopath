
import { useState, useEffect } from 'react';
import { MenuIcon, X } from 'lucide-react';
import Button from './Button';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 lg:px-16 py-4 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/411fb9d2-e378-4aba-8c13-a7b3f77e6e75.png" 
            alt="Anondopath Logo" 
            className="h-10"
          />
          <span className={`text-xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-anondopath-blue' : 'text-anondopath-blue'
          }`}>
            Anondopath
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/features" 
            className={`transition-colors ${
              isActive('/features') 
                ? 'text-anondopath-teal font-medium' 
                : 'text-anondopath-blue hover:text-anondopath-teal'
            }`}
          >
            Features
          </Link>
          <Link 
            to="/how-it-works" 
            className={`transition-colors ${
              isActive('/how-it-works') 
                ? 'text-anondopath-teal font-medium' 
                : 'text-anondopath-blue hover:text-anondopath-teal'
            }`}
          >
            How It Works
          </Link>
          <Link 
            to="/testimonials" 
            className={`transition-colors ${
              isActive('/testimonials') 
                ? 'text-anondopath-teal font-medium' 
                : 'text-anondopath-blue hover:text-anondopath-teal'
            }`}
          >
            Testimonials
          </Link>
          <Link 
            to="/pricing" 
            className={`transition-colors ${
              isActive('/pricing') 
                ? 'text-anondopath-teal font-medium' 
                : 'text-anondopath-blue hover:text-anondopath-teal'
            }`}
          >
            Pricing
          </Link>
          <Link 
            to="/blog" 
            className={`transition-colors ${
              isActive('/blog') 
                ? 'text-anondopath-teal font-medium' 
                : 'text-anondopath-blue hover:text-anondopath-teal'
            }`}
          >
            Blog
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button variant="primary" size="sm" animate>
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-anondopath-blue"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <MenuIcon size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg pb-4 px-4 pt-2 animate-fade-in">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/features" 
              className={`py-2 border-b border-gray-100 ${
                isActive('/features') ? 'text-anondopath-teal font-medium' : 'text-anondopath-blue'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className={`py-2 border-b border-gray-100 ${
                isActive('/how-it-works') ? 'text-anondopath-teal font-medium' : 'text-anondopath-blue'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/testimonials" 
              className={`py-2 border-b border-gray-100 ${
                isActive('/testimonials') ? 'text-anondopath-teal font-medium' : 'text-anondopath-blue'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link 
              to="/pricing" 
              className={`py-2 border-b border-gray-100 ${
                isActive('/pricing') ? 'text-anondopath-teal font-medium' : 'text-anondopath-blue'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/blog" 
              className={`py-2 border-b border-gray-100 ${
                isActive('/blog') ? 'text-anondopath-teal font-medium' : 'text-anondopath-blue'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Button>
              <Button variant="primary" animate onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
