
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    title: "Interactive Virtual Labs",
    description: "Our virtual labs provide students with hands-on experience in a safe, controlled environment.",
    buttonText: "Explore Labs",
    buttonUrl: "#labs"
  },
  {
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
    title: "Real-time Collaboration",
    description: "Students can work together on projects in real-time, regardless of their physical location.",
    buttonText: "Try Collaboration",
    buttonUrl: "#collaboration"
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    title: "Advanced Analytics",
    description: "Track student progress and identify areas for improvement with our comprehensive analytics tools.",
    buttonText: "View Analytics",
    buttonUrl: "#analytics"
  }
];

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, isAutoPlaying, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="blue-gradient-text">MVP</span> Feature Highlights
        </h2>

        <div 
          className="flex flex-col lg:flex-row items-center gap-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Image Area */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative mx-auto w-full max-w-md aspect-[4/3]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-anondopath-blue/10 to-anondopath-teal/10 blur-md transform -rotate-3"></div>
              <div className="relative overflow-hidden rounded-xl glass shadow-xl">
                <div className="w-full h-full overflow-hidden">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                  <button 
                    onClick={prevSlide}
                    className="bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
                
                {/* Indicators */}
                <div className="absolute bottom-4 left-4 flex space-x-2 z-20">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-white w-6' 
                          : 'bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="w-full lg:w-1/2 space-y-6">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 transform ${
                  index === currentSlide 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0 absolute'
                }`}
                style={{ display: index === currentSlide ? 'block' : 'none' }}
              >
                <h3 className="text-2xl font-bold mb-4 blue-gradient-text">
                  {slide.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {slide.description}
                </p>
                <Button variant="primary" animate>
                  {slide.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
