
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, Layers, Zap, Users, Cloud, Star } from 'lucide-react';
import Button from '@/components/Button';

const Features = () => {
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

  const features = [
    {
      icon: <Layers className="w-12 h-12 text-anondopath-teal" />,
      title: "Interactive Simulations",
      description: "Transform complex concepts into engaging interactive experiences that make learning intuitive and memorable."
    },
    {
      icon: <Zap className="w-12 h-12 text-anondopath-teal" />,
      title: "Real-time Feedback",
      description: "Provide immediate feedback to students, helping them understand concepts better and correct mistakes instantly."
    },
    {
      icon: <Users className="w-12 h-12 text-anondopath-teal" />,
      title: "Collaborative Learning",
      description: "Enable students to work together on projects, share insights, and learn from each other in a virtual environment."
    },
    {
      icon: <Cloud className="w-12 h-12 text-anondopath-teal" />,
      title: "Cloud-Based Access",
      description: "Access educational content from anywhere, anytime, on any device with our secure cloud-based platform."
    },
    {
      icon: <Check className="w-12 h-12 text-anondopath-teal" />,
      title: "Progress Tracking",
      description: "Monitor student progress with detailed analytics and reports to identify strengths and areas for improvement."
    },
    {
      icon: <Star className="w-12 h-12 text-anondopath-teal" />,
      title: "Customizable Content",
      description: "Create and customize educational content to meet the specific needs of your curriculum and students."
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
                Platform Features
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Powerful Tools</span> for 
                <br className="hidden md:block" /> Immersive Education
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how our innovative platform transforms traditional learning with interactive simulations, collaborative tools, and personalized experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Feature Set</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform offers a wide range of features designed to enhance the learning experience and make education more engaging and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="rounded-full bg-anondopath-blue/5 p-3 inline-flex mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlight */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-anondopath-blue/10 to-anondopath-teal/10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 slide-up">
                <span className="bg-anondopath-blue/10 text-anondopath-blue px-4 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold mb-6">Virtual Laboratory Experience</h2>
                <p className="text-gray-600 mb-8">
                  Our virtual laboratory provides students with a safe environment to experiment and learn through trial and error, without the constraints of physical resources or safety concerns.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Realistic physics simulations",
                    "Chemical reaction modeling",
                    "Biological system simulations",
                    "Engineering design tools",
                    "Data collection and analysis"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-anondopath-teal min-w-5 h-5 mt-1 mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button variant="primary" animate>Get Started with Virtual Labs</Button>
              </div>
              
              <div className="order-1 lg:order-2 slide-up">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/placeholder.svg"
                    alt="Virtual Laboratory Interface" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-anondopath-blue text-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-3xl mx-auto slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Classroom?</h2>
              <p className="text-white/80 mb-8 text-lg">
                Join thousands of educators who are already using Anondopath to create immersive learning experiences for their students.
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

export default Features;
