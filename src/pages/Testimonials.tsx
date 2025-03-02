
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Quote } from 'lucide-react';
import Button from '@/components/Button';
import TestimonialsSlider from '@/components/TestimonialsSlider';

const Testimonials = () => {
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

  const featuredTestimonials = [
    {
      quote: "Anondopath has completely transformed how I teach science. My students are more engaged than ever before with the interactive simulations. They actually look forward to complex topics now!",
      name: "Dr. Sarah Johnson",
      role: "High School Science Teacher",
      image: "/placeholder.svg",
      stars: 5
    },
    {
      quote: "The virtual lab experiences provided by Anondopath have been a game-changer for our rural school district where access to expensive lab equipment is limited. Now our students have the same opportunities as everyone else.",
      name: "Michael Rodriguez",
      role: "District Technology Coordinator",
      image: "/placeholder.svg",
      stars: 5
    },
    {
      quote: "I've seen a 40% improvement in test scores since implementing Anondopath in my classroom. The way complex concepts are visualized helps students understand and retain information better.",
      name: "Emily Chen",
      role: "Middle School Math Teacher",
      image: "/placeholder.svg",
      stars: 5
    }
  ];

  const videoTestimonials = [
    {
      title: "How Anondopath Transformed Our Science Curriculum",
      name: "Westridge High School",
      thumbnail: "/placeholder.svg",
      duration: "3:45"
    },
    {
      title: "Bringing STEM Education to Remote Communities",
      name: "Rural Education Initiative",
      thumbnail: "/placeholder.svg",
      duration: "5:20"
    },
    {
      title: "Student Success Stories with Anondopath",
      name: "Oakdale Middle School",
      thumbnail: "/placeholder.svg",
      duration: "4:15"
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
                Success Stories
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Real Educators</span>,
                <br className="hidden md:block" /> Real Results
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from teachers, administrators, and students who have transformed their educational experience with Anondopath.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "96%", label: "User Satisfaction" },
                { value: "1,500+", label: "Schools Using Anondopath" },
                { value: "45%", label: "Average Increase in Engagement" },
                { value: "3.8M+", label: "Students Impacted" }
              ].map((stat, index) => (
                <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-4xl font-bold text-anondopath-blue mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Testimonials */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Testimonials</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Read what educators are saying about their experience with Anondopath.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredTestimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex mb-6 text-yellow-400">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  
                  <Quote className="h-8 w-8 text-anondopath-teal/20 mb-4" />
                  
                  <p className="text-gray-700 mb-6 flex-grow">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center mt-auto">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Slider Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-anondopath-blue/5 to-anondopath-teal/5">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Are Saying</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join the thousands of satisfied educators who have transformed their classrooms with Anondopath.
              </p>
            </div>
            
            <TestimonialsSlider />
          </div>
        </section>

        {/* Video Testimonials */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Video Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Watch how Anondopath is making a difference in classrooms around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videoTestimonials.map((video, index) => (
                <div 
                  key={index} 
                  className="slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-video mb-4 group">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button className="h-14 w-14 rounded-full bg-anondopath-teal text-white flex items-center justify-center shadow-lg group-hover:bg-anondopath-blue transition-colors duration-300">
                        <Play className="h-6 w-6 ml-1" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 text-sm rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <p className="text-gray-600">{video.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-anondopath-blue text-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-3xl mx-auto slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Success Story</h2>
              <p className="text-white/80 mb-8 text-lg">
                Experience the Anondopath difference for yourself. Join thousands of educators who are transforming education with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="white">Get Started</Button>
                <Button variant="outline-white">Book a Demo</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
