
import { Zap, Users, BarChart3 } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Immersive Simulations",
    description: "Replace static learning with dynamic, interactive simulations that make complex concepts tangible and engaging.",
    color: "from-blue-500 to-purple-500"
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Collaborative Tools",
    description: "Enable students to work together seamlessly, fostering teamwork and peer learning in a shared virtual space.",
    color: "from-teal-500 to-green-500"
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: "Real-time Feedback",
    description: "Provide instant assessment and personalized guidance to help students understand their progress and improve.",
    color: "from-orange-500 to-pink-500"
  }
];

const FeatureGrid = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 text-sm bg-anondopath-teal/10 text-anondopath-teal rounded-full mb-4">
            Transformative Education
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforming <span className="blue-gradient-text">Classrooms</span>
          </h2>
          <p className="text-gray-600">
            Anondopath replaces traditional learning methods with engaging digital experiences that enhance comprehension and retention.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover border border-gray-100">
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
