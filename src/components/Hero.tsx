
import React from 'react';
import Button from './Button';
import { ArrowRight, Download, BookOpen, Video, BarChart, Lightbulb } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 pb-12 bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-anondopath-teal/5 animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] left-[10%] w-96 h-96 rounded-full bg-anondopath-blue/5 animate-pulse-slow" style={{
          animationDelay: '1s'
        }}></div>
        <div className="absolute top-[30%] left-[15%] w-32 h-32 rounded-full bg-anondopath-teal/10 animate-float"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center gap-8">
          {/* Hero Content */}
          <div className="w-full lg:w-2/3 space-y-8 animate-fade-in text-center mx-auto">
            <div>
              <span className="inline-block py-1 px-3 text-sm bg-anondopath-teal/10 text-anondopath-teal rounded-full mb-4 font-medium">
                Innovative Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="blue-gradient-text">Inspire Students</span> with Immersive Learning
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
                Transform classrooms with interactive simulations that make complex subjects accessible and engaging for every student.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
              <Button size="lg" animate className="shadow-lg">
                Get Started <Download className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                View Pricing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 z-10 mb-8">
            {/* Interactive Quizzes */}
            <div className="glass p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-anondopath-blue/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-anondopath-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Interactive Quizzes</h3>
                  <p className="text-gray-600 text-sm">Engaging quizzes that adapt to each student's learning pace</p>
                </div>
              </div>
            </div>

            {/* Live Sessions */}
            <div className="glass p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-anondopath-teal/10 p-3 rounded-full">
                  <Video className="h-6 w-6 text-anondopath-teal" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Live Sessions</h3>
                  <p className="text-gray-600 text-sm">Real-time learning with expert educators and peers</p>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="glass p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-anondopath-blue/10 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-anondopath-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
                  <p className="text-gray-600 text-sm">Monitor learning journey with detailed analytics</p>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="glass p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="bg-anondopath-teal/10 p-3 rounded-full">
                  <Lightbulb className="h-6 w-6 text-anondopath-teal" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">AI Recommendations</h3>
                  <p className="text-gray-600 text-sm">Personalized learning paths based on individual needs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Image - Now below the floating elements */}
          <div className="w-full max-w-md mx-auto mt-4 relative animate-fade-in" style={{
            animationDelay: '0.3s'
          }}>
            <div className="absolute inset-0 -bottom-10 -z-10 bg-gradient-to-b from-anondopath-blue/10 to-transparent rounded-full blur-xl"></div>
            <img 
              src="/lovable-uploads/411fb9d2-e378-4aba-8c13-a7b3f77e6e75.png" 
              alt="Student using Anondopath" 
              className="w-full h-auto object-contain mx-auto"
            />
          </div>

          {/* Trusted By Section */}
          <div className="w-full pt-8">
            <p className="text-sm text-gray-500 mb-4 font-medium text-center">Trusted by educators worldwide</p>
            <div className="flex flex-wrap gap-8 items-center justify-center">
              <img src="/lovable-uploads/9d825685-acd1-4773-be63-4d20d963ea51.png" alt="Partner logo" className="h-10 object-contain" />
              <img src="/lovable-uploads/b75aad07-8762-4182-bbde-f65c1ce89f14.png" alt="Partner logo" className="h-10 object-contain" />
              <img src="/lovable-uploads/33133015-bac0-40f3-80f6-932c44694ce8.png" alt="Partner logo" className="h-10 object-contain" />
              <img src="/lovable-uploads/9ea336e8-3047-45ea-b900-035bd722b745.png" alt="Partner logo" className="h-10 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
