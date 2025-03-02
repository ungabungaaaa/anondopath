
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  organization: string;
  quote: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Science Teacher",
    organization: "Lincoln High School",
    quote: "Anondopath has transformed how I teach complex scientific concepts. My students are more engaged than ever before.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Department Head",
    organization: "Westview Academy",
    quote: "The virtual labs have made a significant impact on our science curriculum. Students now look forward to experiments.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Technology Coordinator",
    organization: "Oakridge School District",
    quote: "Implementation was seamless, and the support team is always responsive to our needs. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 4,
    name: "David Patel",
    role: "Principal",
    organization: "Greenfield Elementary",
    quote: "Since introducing Anondopath, we've seen a 40% improvement in science test scores across all grade levels.",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: 5,
    name: "Aisha Washington",
    role: "STEM Coordinator",
    organization: "Riverside Middle School",
    quote: "The collaborative tools have encouraged teamwork and critical thinking skills that extend beyond the classroom.",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    id: 6,
    name: "Carlos Mendez",
    role: "Physics Teacher",
    organization: "Central High School",
    quote: "My students can now visualize abstract concepts that were previously difficult to demonstrate in a traditional lab.",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg"
  }
];

const TestimonialsSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  
  // Determine how many testimonials to show based on screen size
  const [itemsToShow, setItemsToShow] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Update visible testimonials based on active index and items to show
    const endIndex = (activeIndex + itemsToShow) % testimonials.length;
    
    if (activeIndex + itemsToShow <= testimonials.length) {
      setVisibleTestimonials(testimonials.slice(activeIndex, activeIndex + itemsToShow));
    } else {
      // Handle wrap-around
      const wrappedItems = [
        ...testimonials.slice(activeIndex),
        ...testimonials.slice(0, endIndex)
      ];
      setVisibleTestimonials(wrappedItems);
    }
  }, [activeIndex, itemsToShow]);
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 text-sm bg-anondopath-blue/10 text-anondopath-blue rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What <span className="blue-gradient-text">Educators</span> Say
          </h2>
          <p className="text-gray-600">
            Hear from teachers and administrators who have transformed their classrooms with Anondopath.
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5 text-anondopath-blue" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5 text-anondopath-blue" />
            </button>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8 md:px-4">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`visible-${testimonial.id}`}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all card-hover border border-gray-100"
              >
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-anondopath-blue to-anondopath-teal blur-sm"></div>
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="relative w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="relative w-12 h-12 rounded-full bg-anondopath-blue flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-anondopath-teal">{testimonial.organization}</p>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-anondopath-teal/20" />
                  <p className="text-gray-700 italic pl-4 pt-2">{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index >= activeIndex && index < activeIndex + itemsToShow 
                    ? 'bg-anondopath-blue w-6' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial set starting at ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
