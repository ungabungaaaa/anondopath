
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { Users, BookOpen, Check, Award, TrendingUp, Globe, Target, Lightbulb, Star, BarChart, ArrowRight } from 'lucide-react';

const AboutUs = () => {
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

  // Team members data
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former professor of Educational Technology with 15+ years experience in developing digital learning tools.",
      image: "/placeholder.svg"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Software engineer and VR specialist who previously developed educational simulations at MIT Media Lab.",
      image: "/placeholder.svg"
    },
    {
      name: "Dr. David Martinez",
      role: "Chief Learning Officer",
      bio: "Education researcher specializing in pedagogical design and learning outcome assessment.",
      image: "/placeholder.svg"
    },
    {
      name: "Emily Richards",
      role: "Head of Content",
      bio: "Former science teacher with expertise in curriculum development and student engagement strategies.",
      image: "/placeholder.svg"
    },
    {
      name: "Alex Thompson",
      role: "Head of Product",
      bio: "UX specialist with a background in designing educational interfaces for diverse learning needs.",
      image: "/placeholder.svg"
    },
    {
      name: "Priya Patel",
      role: "Director of Partnerships",
      bio: "Experienced in building strategic relationships between educational technology and school districts.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center slide-up">
              <span className="bg-anondopath-teal/10 text-anondopath-teal px-4 py-1 rounded-full text-sm font-medium">
                Our Story
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Transforming Education</span> Through Technology
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                We're on a mission to make learning more engaging, accessible, and effective through immersive digital experiences that inspire curiosity and creativity.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 slide-up">
                <span className="text-anondopath-blue font-semibold">OUR MISSION</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Empowering the Next Generation of Innovators
                </h2>
                <p className="text-gray-600 mb-6">
                  At Anondopath, we believe that every student deserves access to high-quality educational experiences that inspire curiosity, foster critical thinking, and build confidence in STEM subjects. Our mission is to break down barriers to learning by creating immersive digital environments that make complex concepts accessible and engaging.
                </p>
                <p className="text-gray-600 mb-8">
                  We're committed to partnering with educators to create a more equitable, effective, and enjoyable learning experience for students of all backgrounds and abilities.
                </p>
                <div className="space-y-4">
                  {[
                    "Democratizing access to advanced learning tools",
                    "Supporting educators with innovative teaching solutions",
                    "Making abstract concepts tangible through visualization",
                    "Fostering collaboration and communication skills"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-anondopath-teal mr-3 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2 slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  <div className="absolute inset-0 -z-10 bg-anondopath-blue/5 rounded-2xl transform rotate-3"></div>
                  <div className="absolute inset-0 -z-10 bg-anondopath-teal/5 rounded-2xl transform -rotate-3"></div>
                  <img 
                    src="/placeholder.svg" 
                    alt="Students learning with Anondopath" 
                    className="rounded-2xl shadow-lg relative z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16 slide-up">
              <span className="text-anondopath-blue font-semibold">OUR VALUES</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Principles That Guide Our Work
              </h2>
              <p className="text-gray-600">
                Our core values influence every decision we make, from product development to customer support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Lightbulb className="h-8 w-8 text-anondopath-teal" />,
                  title: "Innovation",
                  description: "We constantly push boundaries to create new and better ways of learning and teaching."
                },
                {
                  icon: <Target className="h-8 w-8 text-anondopath-teal" />,
                  title: "Accessibility",
                  description: "We're committed to making high-quality education available to all students, regardless of location or resources."
                },
                {
                  icon: <Users className="h-8 w-8 text-anondopath-teal" />,
                  title: "Collaboration",
                  description: "We believe in working closely with educators to develop tools that truly serve their needs and those of their students."
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-anondopath-blue" />,
                  title: "Engagement",
                  description: "We design for curiosity and wonder, creating experiences that make students excited to learn."
                },
                {
                  icon: <Star className="h-8 w-8 text-anondopath-blue" />,
                  title: "Excellence",
                  description: "We hold ourselves to the highest standards in both educational content and technical execution."
                },
                {
                  icon: <BarChart className="h-8 w-8 text-anondopath-blue" />,
                  title: "Impact",
                  description: "We measure our success by the meaningful difference we make in learning outcomes and teaching experiences."
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gray-50 p-3 rounded-full inline-block mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16 slide-up">
              <span className="text-anondopath-blue font-semibold">OUR TEAM</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Meet the People Behind Anondopath
              </h2>
              <p className="text-gray-600">
                Our diverse team brings together expertise in education, technology, design, and more to create innovative learning experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-anondopath-teal font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <a href="#learn-more" className="text-anondopath-blue hover:text-anondopath-teal transition-colors flex items-center text-sm font-medium">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16 slide-up">
              <span className="text-anondopath-blue font-semibold">OUR JOURNEY</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                From Idea to Impact
              </h2>
              <p className="text-gray-600">
                Our story began with a simple question: How can we make learning more engaging and effective through technology?
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              {[
                {
                  year: "2018",
                  title: "The Beginning",
                  description: "Anondopath was founded by Dr. Sarah Johnson after observing how her students struggled to grasp abstract scientific concepts without visualization tools.",
                  icon: <Lightbulb className="h-6 w-6 text-white" />
                },
                {
                  year: "2019",
                  title: "First Prototype",
                  description: "We launched our first virtual laboratory simulation for high school chemistry classes, working with 5 pilot schools to refine our approach.",
                  icon: <BookOpen className="h-6 w-6 text-white" />
                },
                {
                  year: "2020",
                  title: "Remote Learning Solution",
                  description: "When the pandemic hit, we rapidly expanded our offerings to help schools continue science education during remote learning.",
                  icon: <Globe className="h-6 w-6 text-white" />
                },
                {
                  year: "2021",
                  title: "Growth & Expansion",
                  description: "Secured Series A funding to expand our team and build comprehensive curriculum solutions across science, technology, engineering, and mathematics.",
                  icon: <TrendingUp className="h-6 w-6 text-white" />
                },
                {
                  year: "2022",
                  title: "Award-Winning Platform",
                  description: "Received the Educational Technology Innovation Award for our impact on student engagement and learning outcomes.",
                  icon: <Award className="h-6 w-6 text-white" />
                },
                {
                  year: "2023",
                  title: "Today & Beyond",
                  description: "Now serving over 500,000 students across 1,000+ schools, we continue to innovate and expand our vision for immersive education.",
                  icon: <Target className="h-6 w-6 text-white" />
                }
              ].map((milestone, index) => (
                <div key={index} className="relative flex slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline Line */}
                  {index < 5 && (
                    <div className="absolute left-7 top-14 w-0.5 h-full bg-gray-200"></div>
                  )}
                  
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-anondopath-blue to-anondopath-teal rounded-full flex items-center justify-center shadow-md">
                      {milestone.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="ml-8">
                    <span className="text-sm font-bold text-anondopath-blue">{milestone.year}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-16 md:py-24 bg-anondopath-blue">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 slide-up">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Team</h2>
                  <p className="text-gray-600 mb-6">
                    We're always looking for passionate people who want to make a difference in education. Join us in building the future of learning.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-anondopath-teal mr-3 flex-shrink-0 mt-0.5" />
                      <span>Flexible remote-first work environment</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-anondopath-teal mr-3 flex-shrink-0 mt-0.5" />
                      <span>Competitive compensation & benefits</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-anondopath-teal mr-3 flex-shrink-0 mt-0.5" />
                      <span>Meaningful work with real-world impact</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-anondopath-teal mr-3 flex-shrink-0 mt-0.5" />
                      <span>Collaborative, diverse team culture</span>
                    </div>
                  </div>
                  
                  <Button>
                    View Open Positions
                  </Button>
                </div>
                
                <div className="hidden md:block bg-gradient-to-br from-anondopath-blue to-anondopath-teal relative">
                  <div className="absolute inset-0 opacity-20 pattern-dots pattern-white pattern-size-4 pattern-diagonal-lines"></div>
                  <div className="relative p-12 text-white flex items-center h-full">
                    <div className="slide-up">
                      <h3 className="text-xl font-bold mb-4">Current Openings</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>Senior Curriculum Designer</span>
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>Frontend Developer</span>
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>UX/UI Designer</span>
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>Education Partnerships Manager</span>
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>Data Scientist</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
