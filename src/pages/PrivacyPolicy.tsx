
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Table of contents with section IDs
  const tableOfContents = [
    { title: "Introduction", id: "introduction" },
    { title: "Information We Collect", id: "information-collected" },
    { title: "How We Use Your Information", id: "how-we-use" },
    { title: "Data Storage and Security", id: "data-security" },
    { title: "Sharing Your Information", id: "sharing-information" },
    { title: "Your Rights and Choices", id: "your-rights" },
    { title: "Children's Privacy", id: "childrens-privacy" },
    { title: "Changes to This Policy", id: "policy-changes" },
    { title: "Contact Us", id: "contact-us" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto slide-up">
              {/* Breadcrumbs */}
              <div className="flex items-center text-sm text-gray-500 space-x-2 mb-8">
                <Link to="/" className="hover:text-anondopath-blue transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-700">Privacy Policy</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Privacy Policy
              </h1>
              <p className="mt-4 text-gray-600">
                Last Updated: July 1, 2023
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar with Table of Contents */}
                <div className="md:w-64 flex-shrink-0">
                  <div className="sticky top-24 slide-up">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                      <nav className="space-y-2">
                        {tableOfContents.map((item) => (
                          <a 
                            key={item.id}
                            href={`#${item.id}`}
                            className="block text-gray-600 hover:text-anondopath-blue transition-colors py-1"
                          >
                            {item.title}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 slide-up">
                  <div className="prose prose-lg max-w-none">
                    <section id="introduction">
                      <h2>Introduction</h2>
                      <p>
                        At Anondopath, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our educational platform, including any related mobile applications (collectively, the "Platform").
                      </p>
                      <p>
                        Please read this Privacy Policy carefully. By accessing and using our Platform, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Platform.
                      </p>
                      <p>
                        We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
                      </p>
                    </section>

                    <section id="information-collected">
                      <h2>Information We Collect</h2>
                      
                      <h3>Personal Data</h3>
                      <p>
                        We may collect personal information that you voluntarily provide to us when you register for an account, express interest in obtaining information about us or our products and services, participate in activities on the Platform, or otherwise contact us. The personal information we collect may include:
                      </p>
                      <ul>
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Mailing address</li>
                        <li>Phone number</li>
                        <li>Job title and organization (for educators)</li>
                        <li>Profile picture (optional)</li>
                        <li>Billing information (if applicable)</li>
                      </ul>

                      <h3>Student Data</h3>
                      <p>
                        For student users, we limit the collection of personal information to what is necessary for educational purposes. This may include:
                      </p>
                      <ul>
                        <li>Student name or username</li>
                        <li>Grade level</li>
                        <li>School or classroom identifier</li>
                        <li>Performance data within educational activities</li>
                      </ul>
                      <p>
                        We are committed to complying with laws protecting student privacy, including the Family Educational Rights and Privacy Act (FERPA) and the Children's Online Privacy Protection Act (COPPA).
                      </p>

                      <h3>Automatically Collected Information</h3>
                      <p>
                        When you access our Platform, we may automatically collect certain information about your device and usage, including:
                      </p>
                      <ul>
                        <li>Device type and operating system</li>
                        <li>Browser type</li>
                        <li>IP address</li>
                        <li>Access times and dates</li>
                        <li>Referring website address</li>
                        <li>Pages viewed on our Platform</li>
                        <li>Features used and learning activities completed</li>
                        <li>General geographic location (city/country)</li>
                      </ul>
                    </section>

                    <section id="how-we-use">
                      <h2>How We Use Your Information</h2>
                      <p>
                        We may use the information we collect for various purposes, including:
                      </p>
                      <ul>
                        <li>Providing, maintaining, and improving our Platform</li>
                        <li>Creating and managing user accounts</li>
                        <li>Processing transactions and sending related information</li>
                        <li>Responding to inquiries and providing customer support</li>
                        <li>Sending administrative information, such as updates or changes to our terms, conditions, and policies</li>
                        <li>Personalizing user experience and delivering content relevant to user interests</li>
                        <li>Analyzing usage patterns to improve Platform design and functionality</li>
                        <li>Measuring the effectiveness of our educational content</li>
                        <li>Protecting against, identifying, and preventing fraud and other illegal activity</li>
                        <li>Complying with legal obligations</li>
                      </ul>

                      <h3>Educational Use</h3>
                      <p>
                        For student users, we use collected information solely for educational purposes:
                      </p>
                      <ul>
                        <li>Providing personalized learning experiences</li>
                        <li>Tracking progress and achievement</li>
                        <li>Generating reports for educators and administrators</li>
                        <li>Improving educational content and learning pathways</li>
                      </ul>
                    </section>

                    <section id="data-security">
                      <h2>Data Storage and Security</h2>
                      <p>
                        We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                      </p>
                      <p>
                        We maintain data storage practices aligned with industry standards, including:
                      </p>
                      <ul>
                        <li>Encryption of sensitive data both in transit and at rest</li>
                        <li>Regular security assessments and penetration testing</li>
                        <li>Employee training on data protection practices</li>
                        <li>Access controls and authentication requirements</li>
                        <li>Regular backups and disaster recovery planning</li>
                      </ul>
                      <p>
                        Data is stored on secure servers located in the United States. For international users, this may involve the transfer of data across international boundaries. By using our Platform, you consent to having your data transferred to and processed in the United States.
                      </p>
                    </section>

                    <section id="sharing-information">
                      <h2>Sharing Your Information</h2>
                      <p>
                        We may share information in the following situations:
                      </p>
                      <ul>
                        <li><strong>With Schools and Districts:</strong> For accounts established through a school or district, we share student information with authorized school officials in accordance with FERPA and applicable education laws.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share information with trusted vendors, consultants, and other service providers who perform services on our behalf, such as hosting, data analytics, payment processing, email delivery, and customer service.</li>
                        <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, financing due diligence, reorganization, bankruptcy, or sale of company assets, your information may be transferred as part of that transaction.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
                        <li><strong>With Your Consent:</strong> We may share your information with third parties when you have given us your consent to do so.</li>
                      </ul>
                      <p>
                        We do not sell, rent, or trade user personal information to third parties for their marketing purposes.
                      </p>
                    </section>

                    <section id="your-rights">
                      <h2>Your Rights and Choices</h2>
                      <p>
                        Depending on your location, you may have certain rights regarding your personal information:
                      </p>
                      <ul>
                        <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
                        <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information.</li>
                        <li><strong>Deletion:</strong> You can request that we delete your personal information, subject to certain exceptions.</li>
                        <li><strong>Restriction:</strong> You can request that we restrict the processing of your information under certain circumstances.</li>
                        <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
                        <li><strong>Objection:</strong> You can object to our processing of your personal information based on our legitimate interests.</li>
                      </ul>
                      <p>
                        To exercise these rights, please contact us using the information provided in the "Contact Us" section. We will respond to your request within a reasonable timeframe.
                      </p>
                      <p>
                        For California residents, please see our CCPA Privacy Notice for additional information about your rights under the California Consumer Privacy Act.
                      </p>
                    </section>

                    <section id="childrens-privacy">
                      <h2>Children's Privacy</h2>
                      <p>
                        Our Platform is designed for use by both adults and children, including those under 13 years of age. When we collect personal information from children under 13, we do so in compliance with the Children's Online Privacy Protection Act (COPPA).
                      </p>
                      <p>
                        For school-based users, we rely on schools to obtain appropriate parental consent for children under 13 to use our Platform. Schools are responsible for providing appropriate notice to parents and obtaining consent when required.
                      </p>
                      <p>
                        For individual accounts not associated with a school, we require parental consent before collecting personal information from children under 13.
                      </p>
                      <p>
                        Parents and legal guardians can review, edit, request deletion, or refuse further collection or use of their child's personal information by contacting us using the information in the "Contact Us" section.
                      </p>
                    </section>

                    <section id="policy-changes">
                      <h2>Changes to This Policy</h2>
                      <p>
                        We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. The revised policy will be effective immediately upon posting.
                      </p>
                      <p>
                        For material changes, we will provide notification through the Platform or by sending an email to the address associated with your account. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
                      </p>
                    </section>

                    <section id="contact-us">
                      <h2>Contact Us</h2>
                      <p>
                        If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
                      </p>
                      <p>
                        <strong>Anondopath, Inc.</strong><br />
                        Attn: Privacy Officer<br />
                        123 Education Lane<br />
                        San Francisco, CA 94107<br />
                        Email: privacy@anondopath.com<br />
                        Phone: (555) 123-4567
                      </p>
                      <p>
                        For questions specifically about student data, please contact:<br />
                        studentprivacy@anondopath.com
                      </p>
                    </section>
                  </div>
                  
                  {/* Next Steps */}
                  <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-gray-600">Have any questions about our privacy practices?</p>
                      <Link to="/contact" className="text-anondopath-blue hover:text-anondopath-teal transition-colors inline-flex items-center mt-2">
                        Contact our privacy team <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                    <Link to="/terms-of-service" className="text-anondopath-blue hover:text-anondopath-teal transition-colors inline-flex items-center">
                      View Terms of Service <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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

export default PrivacyPolicy;
