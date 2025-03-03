
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImageSlider from '@/components/ImageSlider';
import HowItWorks from '@/components/HowItWorks';
import PartnersSlider from '@/components/PartnersSlider';
import FeatureGrid from '@/components/FeatureGrid';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import NewsletterSignup from '@/components/NewsletterSignup';
import BookDemo from '@/components/BookDemo';
import Footer from '@/components/Footer';

const Index = () => {
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
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    const elements = document.querySelectorAll('.slide-up, .fade-in-section');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Header />
      <main>
        <Hero />
        <div className="slide-up">
          <ImageSlider />
        </div>
        <div className="slide-up">
          <HowItWorks />
        </div>
        <div className="slide-up">
          <PartnersSlider />
        </div>
        <div className="slide-up">
          <FeatureGrid />
        </div>
        <div className="slide-up">
          <TestimonialsSlider />
        </div>
        <div className="slide-up">
          <NewsletterSignup />
        </div>
        <div className="slide-up">
          <BookDemo />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
