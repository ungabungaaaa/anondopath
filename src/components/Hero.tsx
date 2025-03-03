
import React from 'react';
import Button from './Button';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 pb-12 bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-anondopath-teal/5 animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] left-[10%] w-96 h-96 rounded-full bg-anondopath-blue/5 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[30%] left-[15%] w-32 h-32 rounded-full bg-anondopath-teal/10 animate-float"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-8 animate-fade-in">
            <div>
              <span className="inline-block py-1 px-3 text-sm bg-anondopath-teal/10 text-anondopath-teal rounded-full mb-4 font-medium">
                Innovative Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="blue-gradient-text">Inspire Students</span> with Immersive Learning
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
                Transform classrooms with interactive simulations that make complex subjects accessible and engaging for every student.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" animate className="shadow-lg">
                Get Started <Download className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                View Pricing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4 font-medium">Trusted by educators worldwide</p>
              <div className="flex flex-wrap gap-8 items-center">
                <img src="/lovable-uploads/9d825685-acd1-4773-be63-4d20d963ea51.png" alt="Partner logo" className="h-10 object-contain" />
                <img src="/lovable-uploads/b75aad07-8762-4182-bbde-f65c1ce89f14.png" alt="Partner logo" className="h-10 object-contain" />
                <img src="/lovable-uploads/33133015-bac0-40f3-80f6-932c44694ce8.png" alt="Partner logo" className="h-10 object-contain" />
                <img src="/lovable-uploads/9ea336e8-3047-45ea-b900-035bd722b745.png" alt="Partner logo" className="h-10 object-contain" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-anondopath-blue/20 to-anondopath-teal/20 blur-xl transform rotate-3 animate-float"></div>
              <div className="relative glass rounded-2xl p-2 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80" 
                  alt="Student using Anondopath" 
                  className="rounded-xl w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center transform transition-transform hover:scale-110 cursor-pointer">
                      <span className="text-anondopath-blue text-xl font-bold">▶</span>
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-medium">Watch Demo</h3>
                      <p className="text-white/80 text-xs">1:45 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
