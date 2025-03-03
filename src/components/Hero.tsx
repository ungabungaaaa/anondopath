
import React from 'react';
import Button from './Button';
import { ArrowRight, Download, BookOpen, Video, BarChart, Brain } from 'lucide-react';

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
        <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-8 lg:gap-16">
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

          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center animate-fade-in relative" style={{ animationDelay: '0.3s' }}>
            {/* Student Image */}
            <div className="relative z-20 flex justify-center">
              <img 
                src="/lovable-uploads/022a91d5-ea41-4a8a-be2e-d5c7d470432f.png" 
                alt="Student ready for learning" 
                className="h-auto max-h-[500px] object-contain relative z-20"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute h-full w-full left-0 top-0 z-10">
              {/* Interactive Quizzes Card */}
              <div className="glass absolute -left-4 top-[15%] md:left-0 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-blue/10 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-anondopath-blue" />
                  </div>
                  <p className="font-medium text-sm md:text-base">Interactive Quizzes</p>
                </div>
              </div>
              
              {/* Live Sessions Card */}
              <div className="glass absolute right-0 top-[30%] p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-teal/10 p-2 rounded-lg">
                    <Video className="h-5 w-5 text-anondopath-teal" />
                  </div>
                  <p className="font-medium text-sm md:text-base">Live Sessions</p>
                </div>
              </div>
              
              {/* Progress Tracking Card */}
              <div className="glass absolute -left-6 md:left-0 bottom-[30%] p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-cyan/10 p-2 rounded-lg">
                    <BarChart className="h-5 w-5 text-anondopath-cyan" />
                  </div>
                  <p className="font-medium text-sm md:text-base">Progress Tracking</p>
                </div>
              </div>
              
              {/* AI Recommendations Card */}
              <div className="glass absolute right-4 bottom-[10%] p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-anondopath-navy/10 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-anondopath-navy" />
                  </div>
                  <p className="font-medium text-sm md:text-base">AI Recommendations</p>
                </div>
              </div>
            </div>
            
            {/* Background gradient for the right section */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 rounded-3xl blur-xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
