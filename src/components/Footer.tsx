import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
interface FooterLink {
  title: string;
  href: string;
}
interface FooterColumn {
  title: string;
  links: FooterLink[];
}
const footerColumns: FooterColumn[] = [{
  title: "Product",
  links: [{
    title: "Simulations",
    href: "#simulations"
  }, {
    title: "Virtual Labs",
    href: "#labs"
  }, {
    title: "Collaborative Tools",
    href: "#tools"
  }, {
    title: "Pricing",
    href: "#pricing"
  }, {
    title: "Updates",
    href: "#updates"
  }]
}, {
  title: "Users",
  links: [{
    title: "Login",
    href: "#login"
  }, {
    title: "Register",
    href: "#register"
  }, {
    title: "Educator Community",
    href: "#community"
  }, {
    title: "Help Center",
    href: "#help"
  }, {
    title: "Training Resources",
    href: "#training"
  }]
}, {
  title: "Resources",
  links: [{
    title: "Blog",
    href: "#blog"
  }, {
    title: "Events",
    href: "#events"
  }, {
    title: "Podcasts",
    href: "#podcasts"
  }, {
    title: "Research",
    href: "#research"
  }, {
    title: "Case Studies",
    href: "#case-studies"
  }]
}, {
  title: "More",
  links: [{
    title: "About Us",
    href: "#about"
  }, {
    title: "Careers",
    href: "#careers"
  }, {
    title: "Privacy Policy",
    href: "#privacy"
  }, {
    title: "Terms of Service",
    href: "#terms"
  }, {
    title: "Sitemap",
    href: "#sitemap"
  }]
}];
const socialIcons = [{
  icon: <Facebook size={20} />,
  href: "#facebook",
  label: "Facebook"
}, {
  icon: <Twitter size={20} />,
  href: "#twitter",
  label: "Twitter"
}, {
  icon: <Instagram size={20} />,
  href: "#instagram",
  label: "Instagram"
}, {
  icon: <Youtube size={20} />,
  href: "#youtube",
  label: "YouTube"
}, {
  icon: <Linkedin size={20} />,
  href: "#linkedin",
  label: "LinkedIn"
}];
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and Contact Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/lovable-uploads/b75aad07-8762-4182-bbde-f65c1ce89f14.png" alt="Anondopath Logo" className="h-10 mr-3" />
              <span className="text-xl font-bold text-anondopath-blue">Anondopath</span>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-xs">
              Transforming education through immersive digital learning experiences that inspire and engage students worldwide.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone size={18} className="mr-3 text-anondopath-teal" />
                <span>+88 01789-229459</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={18} className="mr-3 text-anondopath-teal" />
                <span>support@anondopath.com</span>
              </div>
              <div className="flex items-start text-gray-600">
                <MapPin size={18} className="mr-3 mt-1 text-anondopath-teal" />
                <span>123 Mothihar Thana, Kajla, Rajshahi</span>
              </div>
            </div>
          </div>
          
          {/* Footer Columns */}
          {footerColumns.map((column, index) => <div key={index}>
              <h3 className="font-bold text-gray-800 mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => <li key={linkIndex}>
                    <a href={link.href} className="text-gray-600 hover:text-anondopath-blue transition-colors">
                      {link.title}
                    </a>
                  </li>)}
              </ul>
            </div>)}
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                &copy; {currentYear} Anondopath. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => <a key={index} href={social.href} className="w-10 h-10 rounded-full bg-gray-200 hover:bg-anondopath-blue hover:text-white text-gray-600 flex items-center justify-center transition-colors" aria-label={social.label}>
                  {social.icon}
                </a>)}
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;