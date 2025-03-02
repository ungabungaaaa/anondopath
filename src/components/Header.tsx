
import { useState, useEffect } from 'react';
import { MenuIcon, X } from 'lucide-react';
import Button from './Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 lg:px-16 py-4 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/b75aad07-8762-4182-bbde-f65c1ce89f14.png" 
            alt="Anondopath Logo" 
            className="h-10"
          />
          <span className={`text-xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-anondopath-blue' : 'text-anondopath-blue'
          }`}>
            Anondopath
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-anondopath-blue hover:text-anondopath-teal transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-anondopath-blue hover:text-anondopath-teal transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-anondopath-blue hover:text-anondopath-teal transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-anondopath-blue hover:text-anondopath-teal transition-colors">
            Pricing
          </a>
          <a href="#blog" className="text-anondopath-blue hover:text-anondopath-teal transition-colors">
            Blog
          </a>
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
            <a 
              href="#features" 
              className="text-anondopath-blue py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-anondopath-blue py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="text-anondopath-blue py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="text-anondopath-blue py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#blog" 
              className="text-anondopath-blue py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </a>
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
