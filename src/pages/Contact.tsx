
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    company: '',
    role: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // In a real app, you would send this data to your backend
    
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        company: '',
        role: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center slide-up">
              <span className="bg-anondopath-teal/10 text-anondopath-teal px-4 py-1 rounded-full text-sm font-medium">
                Get in Touch
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">We'd Love to Hear</span> From You
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about our platform, pricing, or need support? Our team is here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MapPin className="h-8 w-8 text-anondopath-teal" />,
                  title: "Visit Us",
                  details: [
                    "123 Education Lane",
                    "Innovation District",
                    "San Francisco, CA 94107",
                    "United States"
                  ]
                },
                {
                  icon: <Phone className="h-8 w-8 text-anondopath-blue" />,
                  title: "Call Us",
                  details: [
                    "+1 (555) 123-4567",
                    "+1 (555) 987-6543"
                  ]
                },
                {
                  icon: <Mail className="h-8 w-8 text-anondopath-teal" />,
                  title: "Email Us",
                  details: [
                    "support@anondopath.com",
                    "sales@anondopath.com",
                    "info@anondopath.com"
                  ]
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <div className="space-y-2">
                    {item.details.map((detail, i) => (
                      <p key={i} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl p-6 md:p-8 slide-up">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <Clock className="h-6 w-6 text-anondopath-blue mr-3" />
                  <h3 className="text-lg font-bold">Office Hours</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-gray-600">9:00 AM - 6:00 PM (PST)</p>
                  </div>
                  <div>
                    <p className="font-medium">Saturday</p>
                    <p className="text-gray-600">10:00 AM - 2:00 PM (PST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="slide-up">
                  <span className="text-anondopath-blue font-semibold">CONTACT US</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Fill out the form below, and our team will get back to you within 24 hours. We're here to answer any questions you might have about our platform, services, or how we can help your school or district.
                  </p>
                  
                  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-anondopath-blue to-anondopath-teal rounded-t-xl"></div>
                    
                    {formSubmitted ? (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                        <p className="text-gray-600 mb-6">
                          Your message has been sent successfully. We'll get back to you as soon as possible.
                        </p>
                        <Button onClick={() => setFormSubmitted(false)}>
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name*
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address*
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                              placeholder="your.email@example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                              placeholder="(123) 456-7890"
                            />
                          </div>
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                              School/Organization
                            </label>
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                              placeholder="Your school or organization"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal bg-white"
                          >
                            <option value="">Select your role</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Administrator">Administrator</option>
                            <option value="IT Staff">IT Staff</option>
                            <option value="Student">Student</option>
                            <option value="Parent">Parent</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject*
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal bg-white"
                          >
                            <option value="">Select a subject</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Product Information">Product Information</option>
                            <option value="Pricing">Pricing</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Partnership">Partnership Opportunity</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Message*
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                            placeholder="How can we help you?"
                          ></textarea>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="consent"
                            required
                            className="h-4 w-4 text-anondopath-blue focus:ring-anondopath-teal border-gray-300 rounded"
                          />
                          <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
                            I agree to the processing of my personal data in accordance with the <a href="#privacy-policy" className="text-anondopath-blue hover:underline">Privacy Policy</a>
                          </label>
                        </div>
                        
                        <Button type="submit" className="w-full md:w-auto">
                          <span className="flex items-center">
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </span>
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
                
                <div className="slide-up hidden lg:block" style={{ animationDelay: '0.2s' }}>
                  {/* FAQ section */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-gray-200">
                      <div className="flex items-center">
                        <MessageSquare className="h-6 w-6 text-anondopath-blue mr-3" />
                        <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {[
                        {
                          question: "How quickly can I expect a response?",
                          answer: "We typically respond to all inquiries within 24 business hours. For urgent technical support, responses may be even faster."
                        },
                        {
                          question: "Do you offer demos for schools?",
                          answer: "Yes! We're happy to schedule a personalized demo for your school or district. Please mention this in your message, and our team will coordinate with you."
                        },
                        {
                          question: "What information should I include in my message?",
                          answer: "For the quickest assistance, please include details about your school/district, the grade levels you work with, and specific questions about our platform."
                        },
                        {
                          question: "Can I visit your office in person?",
                          answer: "We welcome visitors to our office! Please contact us in advance to schedule an appointment so we can ensure someone is available to meet with you."
                        },
                        {
                          question: "Do you provide support outside of business hours?",
                          answer: "For urgent technical issues, we offer limited after-hours support. Please use the emergency contact provided in your account dashboard."
                        }
                      ].map((faq, index) => (
                        <div key={index} className="p-6 md:p-8">
                          <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Visit Our Office
              </h2>
              <p className="text-gray-600">
                We're located in the heart of San Francisco's Innovation District, easily accessible by public transportation.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden slide-up">
              {/* This would be a real map in a production site */}
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Interactive Map Would Be Displayed Here</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start md:items-center mb-4 md:mb-0">
                    <MapPin className="h-5 w-5 text-anondopath-teal mr-2 mt-1 md:mt-0" />
                    <p className="text-gray-700">123 Education Lane, Innovation District, San Francisco, CA 94107</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
