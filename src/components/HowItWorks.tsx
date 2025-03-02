
import { PlayCircle, CheckCircle } from 'lucide-react';
import Button from './Button';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Create Your Virtual Lab",
    description: "Set up your customized virtual laboratory environment with just a few clicks.",
    icon: <CheckCircle className="h-6 w-6 text-anondopath-teal" />
  },
  {
    number: "02",
    title: "Invite Your Students",
    description: "Share access codes or direct links to bring your students into the virtual environment.",
    icon: <CheckCircle className="h-6 w-6 text-anondopath-teal" />
  },
  {
    number: "03",
    title: "Facilitate Interactive Learning",
    description: "Guide students through experiments and simulations with real-time interaction tools.",
    icon: <CheckCircle className="h-6 w-6 text-anondopath-teal" />
  },
  {
    number: "04",
    title: "Track Progress & Results",
    description: "Monitor student engagement and comprehension with detailed analytics dashboards.",
    icon: <CheckCircle className="h-6 w-6 text-anondopath-teal" />
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-anondopath-teal/5 blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 rounded-full bg-anondopath-blue/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 text-sm bg-anondopath-blue/10 text-anondopath-blue rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How <span className="blue-gradient-text">Anondopath</span> Works
          </h2>
          <p className="text-gray-600">
            Our platform makes it easy to create immersive learning experiences that engage students and enhance understanding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow card-hover"
            >
              <div className="absolute -top-3 -left-3 w-12 h-12 rounded-lg bg-gradient-to-br from-anondopath-blue to-anondopath-teal flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3 text-anondopath-blue">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="flex items-center">
                  {step.icon}
                  <span className="ml-2 text-sm text-anondopath-teal font-medium">Simple & Easy</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="primary" size="lg" animate>
            <PlayCircle className="mr-2 h-5 w-5" />
            See How Our Lab Works
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
