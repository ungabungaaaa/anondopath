
import React from 'react';
import Button from './Button';
import { ArrowRight, Download, BookOpen, Video, BarChart, Lightbulb } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-36 pb-16 bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-anondopath-teal/5 animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] left-[10%] w-96 h-96 rounded-full bg-anondopath-blue/5 animate-pulse-slow" style={{
          animationDelay: '1s'
        }}></div>
        <div className="absolute top-[30%] left-[15%] w-32 h-32 rounded-full bg-anondopath-teal/10 animate-float"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Hero Content - Left Side */}
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
          </div>

          {/* Right side with Student Image and Floating Cards */}
          <div className="w-full lg:w-1/2 relative min-h-[460px] mt-12 md:mt-0">
            {/* Student Image - Positioned in background */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 -bottom-6 -z-10 bg-gradient-to-b from-anondopath-blue/10 to-transparent rounded-full blur-lg"></div>
                <img 
                  src="/lovable-uploads/c7a21bf4-8511-4c59-aae7-14943856658e.png" 
                  alt="Student using Anondopath" 
                  className="h-auto max-h-[400px] object-contain mx-auto rounded-2xl shadow-md"
                />
              </div>
            </div>

            {/* Floating Feature Cards - Positioned in foreground */}
            <div className="relative z-20 grid grid-cols-2 gap-3 md:gap-4">
              {/* Interactive Quizzes */}
              <div className="glass p-3 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/95 backdrop-blur-md ml-0 md:ml-3 mt-0 md:mt-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-blue/10 p-2 rounded-full">
                    <BookOpen className="h-4 w-4 text-anondopath-blue" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Interactive Quizzes</h3>
                </div>
              </div>

              {/* Live Sessions */}
              <div className="glass p-3 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/95 backdrop-blur-md mr-0 md:mr-3 mt-0 md:mt-36 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-teal/10 p-2 rounded-full">
                    <Video className="h-4 w-4 text-anondopath-teal" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Live Sessions</h3>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="glass p-3 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/95 backdrop-blur-md ml-0 md:ml-8 mt-0 md:mt-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-blue/10 p-2 rounded-full">
                    <BarChart className="h-4 w-4 text-anondopath-blue" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Progress Tracking</h3>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="glass p-3 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/95 backdrop-blur-md mr-0 md:mr-5 mt-0 md:mt-44 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-teal/10 p-2 rounded-full">
                    <Lightbulb className="h-4 w-4 text-anondopath-teal" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">AI Recommendations</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="w-full pt-16 mt-6">
          <p className="text-sm text-gray-500 mb-4 font-medium text-center">Trusted by educators worldwide</p>
          <div className="flex flex-wrap gap-8 items-center justify-center">
            <img src="/lovable-uploads/b75aad07-8762-4182-bbde-f65c1ce89f14.png" alt="Partner logo" className="h-10 object-contain" />
            <img src="/lovable-uploads/9ea336e8-3047-45ea-b900-035bd722b745.png" alt="Partner logo" className="h-10 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
