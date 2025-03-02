
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, HelpCircle } from 'lucide-react';
import Button from '@/components/Button';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  // Add intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.slide-up');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual teachers or small classrooms",
      monthlyPrice: 29,
      annualPrice: 290,
      savings: "Save $58",
      features: [
        "Up to 30 student accounts",
        "Basic interactive simulations",
        "Core curriculum resources",
        "Basic analytics",
        "Email support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for schools and departments",
      monthlyPrice: 79,
      annualPrice: 790,
      savings: "Save $158",
      features: [
        "Up to 150 student accounts",
        "Advanced simulations & virtual labs",
        "Full curriculum integration",
        "Comprehensive analytics",
        "Priority support",
        "Teacher training & resources",
        "Custom branding"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For districts and large educational organizations",
      monthlyPrice: 199,
      annualPrice: 1990,
      savings: "Save $398",
      features: [
        "Unlimited student accounts",
        "All Professional features",
        "Advanced admin controls",
        "API access & integrations",
        "Dedicated account manager",
        "Custom development options",
        "On-site training & workshops"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the pricing work?",
      answer: "Our pricing is based on the number of student accounts and features needed. You can choose between monthly or annual billing, with annual billing offering significant savings. All plans include core features, with higher tiers offering more advanced capabilities and support options."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can upgrade your plan at any time, and the new features will be immediately available. If you need to downgrade, the change will take effect at the start of your next billing cycle. Your account manager can help you with any plan changes."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial of our Professional plan, giving you full access to test the platform with your students before committing. No credit card is required to start your trial."
    },
    {
      question: "Are there discounts for educational institutions?",
      answer: "We offer special pricing for educational institutions, particularly for public schools, non-profits, and organizations in underserved communities. Contact our sales team to learn about our education discount program."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. For Enterprise customers, we can also accommodate purchase orders and other institutional payment methods."
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-4xl mx-auto slide-up">
              <span className="bg-anondopath-teal/10 text-anondopath-teal px-4 py-1 rounded-full text-sm font-medium">
                Flexible Plans
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Transparent Pricing</span> for
                <br className="hidden md:block" /> Every Educational Need
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your school or district's needs, with flexible options for classrooms of all sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg slide-up">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isAnnual ? 'bg-white shadow-sm text-anondopath-blue' : 'text-gray-500'
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual (Save 20%)
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  !isAnnual ? 'bg-white shadow-sm text-anondopath-blue' : 'text-gray-500'
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 slide-up ${
                    plan.popular 
                      ? 'border-2 border-anondopath-teal shadow-xl scale-105 md:scale-110 relative z-10' 
                      : 'border border-gray-200 shadow-sm'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="bg-anondopath-teal text-white py-2 text-center text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-end">
                        <span className="text-4xl font-bold">
                          ${isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice}
                        </span>
                        <span className="text-gray-600 ml-2 mb-1">/month</span>
                      </div>
                      
                      {isAnnual && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Billed annually at ${plan.annualPrice}</span>
                          <br />
                          <span className="text-sm font-medium text-anondopath-teal">{plan.savings}</span>
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-anondopath-teal mt-0.5 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={plan.popular ? "primary" : "outline"} 
                      className="w-full" 
                      animate={plan.popular}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-anondopath-blue/10 to-anondopath-teal/10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 md:p-12 slide-up">
                  <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
                  <p className="text-gray-600 mb-6">
                    We work with educational districts, universities, and organizations of all sizes to create tailored solutions that meet unique needs.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "Custom implementation plans",
                      "Dedicated success manager",
                      "System integrations",
                      "Custom content development",
                      "On-site training and support",
                      "Volume discounts"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-anondopath-teal mt-0.5 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="primary" animate>Schedule a Consultation</Button>
                </div>
                
                <div className="bg-gradient-to-br from-anondopath-blue to-anondopath-teal p-8 md:p-12 text-white flex items-center">
                  <div className="slide-up">
                    <h3 className="text-2xl font-bold mb-6">Enterprise Benefits</h3>
                    <ul className="space-y-4">
                      {[
                        "Scalable to any number of users",
                        "Centralized management",
                        "Advanced security features",
                        "Custom reporting and analytics",
                        "Priority 24/7 support",
                        "Ongoing consultation and strategy"
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our pricing and plans.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start mb-3">
                      <HelpCircle className="h-5 w-5 text-anondopath-teal mt-1 mr-3 flex-shrink-0" />
                      <h3 className="text-lg font-semibold">{faq.question}</h3>
                    </div>
                    <p className="text-gray-600 pl-8">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-anondopath-blue text-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-3xl mx-auto slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Education?</h2>
              <p className="text-white/80 mb-8 text-lg">
                Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="white">Start Free Trial</Button>
                <Button variant="outline-white">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
