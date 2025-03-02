
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
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.slide-up');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ImageSlider />
        <HowItWorks />
        <PartnersSlider />
        <FeatureGrid />
        <TestimonialsSlider />
        <NewsletterSignup />
        <BookDemo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
