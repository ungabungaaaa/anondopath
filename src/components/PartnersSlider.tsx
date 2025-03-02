
import React, { useEffect, useRef } from 'react';

const partners = [
  { id: 1, name: "ITU", grayscale: true },
  { id: 2, name: "GCYLP", grayscale: true },
  { id: 3, name: "Accelerating Bangladesh", grayscale: true },
  { id: 4, name: "Learning Partner", grayscale: true },
  { id: 5, name: "Education First", grayscale: true },
  { id: 6, name: "Global Learning", grayscale: true },
  { id: 7, name: "Tech School", grayscale: true },
  { id: 8, name: "Digital Education", grayscale: true }
];

const PartnersSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider1 = sliderRef.current;
    const slider2 = sliderRef2.current;
    
    if (!slider1 || !slider2) return;

    let animationFrameId: number;
    let xPos1 = 0;
    let xPos2 = 0;
    const speed = 0.5;

    const animate = () => {
      if (slider1 && slider2) {
        xPos1 -= speed;
        xPos2 += speed;
        
        // Reset position when slid completely
        const slideWidth = slider1.firstElementChild?.clientWidth || 0;
        if (Math.abs(xPos1) >= slideWidth) {
          xPos1 = 0;
        }
        if (Math.abs(xPos2) >= slideWidth) {
          xPos2 = 0;
        }
        
        slider1.style.transform = `translateX(${xPos1}px)`;
        slider2.style.transform = `translateX(${xPos2}px)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="section-padding py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto text-center mb-8">
        <h3 className="text-2xl font-bold mb-4 text-anondopath-blue">Trusted By Leading Organizations</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Anondopath partners with premier educational institutions and organizations worldwide to transform learning experiences.
        </p>
      </div>
      
      <div className="relative w-full overflow-hidden">
        <div className="flex space-x-16 overflow-hidden">
          <div ref={sliderRef} className="flex space-x-16 min-w-full">
            {partners.map((partner) => (
              <div key={partner.id} className="flex-shrink-0 h-16 w-32 flex items-center justify-center">
                <div className={`bg-gray-100 rounded-lg h-10 w-full flex items-center justify-center 
                  ${partner.grayscale ? 'grayscale' : ''} hover:grayscale-0 transition-all`}
                >
                  <span className="text-gray-500 font-medium">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative w-full overflow-hidden mt-8">
        <div className="flex space-x-16 overflow-hidden">
          <div ref={sliderRef2} className="flex space-x-16 min-w-full">
            {[...partners].reverse().map((partner) => (
              <div key={`reverse-${partner.id}`} className="flex-shrink-0 h-16 w-32 flex items-center justify-center">
                <div className={`bg-gray-100 rounded-lg h-10 w-full flex items-center justify-center 
                  ${partner.grayscale ? 'grayscale' : ''} hover:grayscale-0 transition-all`}
                >
                  <span className="text-gray-500 font-medium">{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSlider;
