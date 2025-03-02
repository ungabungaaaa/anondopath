
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import Button from './Button';
import { toast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter.",
        variant: "default"
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section className="section-padding py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-anondopath-blue/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-anondopath-teal/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10 px-4">
        <div className="bg-gradient-to-br from-anondopath-blue to-anondopath-teal rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
          <div className="px-6 py-10 md:px-8 md:py-12 lg:p-12 bg-white/5 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Stay Updated with Educational Innovations
                  </h2>
                  <p className="text-white/80">
                    Join our newsletter to receive the latest updates, teaching resources, and exclusive offers.
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {['Monthly teaching resources', 'Early access to new features', 'Exclusive webinars and events'].map((item, i) => (
                    <li key={i} className="flex items-center text-white/90">
                      <CheckCircle className="h-5 w-5 mr-2 text-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Subscribe to Our Newsletter
                </h3>
                
                {isSubscribed ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h4 className="text-white text-lg font-medium mb-2">Thank You!</h4>
                    <p className="text-white/80">You've been successfully subscribed to our newsletter.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-anondopath-cyan hover:bg-anondopath-cyan/90 text-white font-semibold shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Subscribe <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    
                    <p className="text-xs text-white/70 text-center mt-4">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
