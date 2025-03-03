
import { CalendarClock } from 'lucide-react';
import Button from './Button';

const BookDemo = () => {
  return (
    <section className="section-padding py-20 bg-white">
      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-anondopath-blue/10 to-anondopath-teal/10 rounded-2xl p-8 md:p-12 relative overflow-hidden transform transition-transform hover:scale-[1.01]">
          {/* Background blur elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-anondopath-teal/20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-anondopath-blue/20 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your <span className="blue-gradient-text">Classroom</span>?
              </h2>
              <p className="text-gray-600 max-w-xl text-lg leading-relaxed">
                Schedule a personalized demonstration to see how Anondopath can revolutionize learning in your institution.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Button size="lg" variant="primary" animate className="shadow-lg">
                <CalendarClock className="mr-2 h-5 w-5" />
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDemo;
