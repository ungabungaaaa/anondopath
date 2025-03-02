
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Play, ChevronRight, ArrowRight, BookOpen, Users, BarChart } from 'lucide-react';
import Button from '@/components/Button';

const HowItWorks = () => {
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

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up for Anondopath and gain access to our full suite of educational tools and resources.",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      number: "02",
      title: "Set Up Your Classroom",
      description: "Add students, create groups, and customize your virtual learning environment to fit your needs.",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "03",
      title: "Implement Learning Activities",
      description: "Choose from our library of simulations and activities or create your own custom learning experiences.",
      icon: <Play className="h-6 w-6" />
    },
    {
      number: "04",
      title: "Monitor Progress",
      description: "Track student engagement and progress with our comprehensive analytics and reporting tools.",
      icon: <BarChart className="h-6 w-6" />
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
                The Process
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Seamless Experience</span> from 
                <br className="hidden md:block" /> Start to Finish
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how easily you can implement Anondopath in your classroom and transform the learning experience for your students.
              </p>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
                <img 
                  src="/placeholder.svg" 
                  alt="How Anondopath Works" 
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="h-20 w-20 rounded-full bg-anondopath-teal text-white flex items-center justify-center shadow-lg hover:bg-anondopath-blue transition-colors duration-300">
                    <Play className="h-8 w-8 ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xl font-medium">See How Anondopath Works</p>
                  <p>2:15 min</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-anondopath-blue/5 to-anondopath-teal/5">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Four Simple Steps</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting started with Anondopath is easy. Just follow these simple steps to transform your classroom.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="absolute -top-5 -left-2 text-6xl font-bold text-anondopath-blue/10">
                    {step.number}
                  </span>
                  <div className="mb-4 rounded-full bg-anondopath-blue/10 h-12 w-12 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-anondopath-teal" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="slide-up">
                <img 
                  src="/placeholder.svg" 
                  alt="Implementation Process" 
                  className="rounded-2xl shadow-xl"
                />
              </div>
              
              <div className="slide-up">
                <span className="bg-anondopath-blue/10 text-anondopath-blue px-4 py-1 rounded-full text-sm font-medium">
                  Implementation
                </span>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold mb-6">Easy Integration with Your Curriculum</h2>
                <p className="text-gray-600 mb-8">
                  Anondopath is designed to complement your existing curriculum, not replace it. Our platform integrates seamlessly with your teaching methods and educational goals.
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Curriculum Mapping",
                      description: "Easily align our resources with your curriculum standards and learning objectives."
                    },
                    {
                      title: "Flexible Implementation",
                      description: "Use our platform for full lessons or as supplementary material to enhance specific topics."
                    },
                    {
                      title: "Teacher Support",
                      description: "Access comprehensive training and support to help you make the most of our platform."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 mt-1">
                        <div className="h-6 w-6 rounded-full bg-anondopath-teal/20 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-anondopath-teal" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-anondopath-blue/5 to-anondopath-teal/5">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about implementing and using Anondopath in your classroom.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How much technical knowledge do I need to use Anondopath?",
                  answer: "Very little! Anondopath is designed to be user-friendly for educators of all technical skill levels. Our intuitive interface and comprehensive onboarding process make it easy to get started."
                },
                {
                  question: "Can I customize the simulations for my specific curriculum?",
                  answer: "Yes, you can customize many aspects of our simulations to align with your curriculum requirements. You can adjust parameters, create custom scenarios, and tailor the learning experience to your students' needs."
                },
                {
                  question: "How does Anondopath support different learning styles?",
                  answer: "Our platform incorporates visual, auditory, and kinesthetic learning elements to engage students with diverse learning preferences. The interactive nature of our simulations allows students to learn by doing, seeing, and hearing."
                },
                {
                  question: "What kind of support does Anondopath provide for educators?",
                  answer: "We offer comprehensive support including onboarding assistance, professional development resources, technical support, and a community forum where you can connect with other educators using Anondopath."
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="mb-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-anondopath-blue text-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-3xl mx-auto slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-white/80 mb-8 text-lg">
                See firsthand how Anondopath can transform your classroom with a personalized demo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="white">Book a Demo</Button>
                <Button variant="outline-white">View Pricing</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
