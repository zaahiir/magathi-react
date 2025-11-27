import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Shield,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import amfiLogo from '../assets/amfi_footer.jpg';
import sebiLogo from '../assets/sebi-logo.png';
import nseLogo from '../assets/nse.png';
// Social media icons are now handled by lucide-react

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Calculator', href: '/calculator' }
  ];

  const services = [
    { name: 'Mutual Funds', href: '/mutual-funds' },
    { name: 'Health Insurance', href: '/health-insurance' },
    { name: 'General Insurance', href: '/general-insurance' },
    { name: 'Fixed Deposits', href: '/deposits' },
    { name: 'Commission Disclosure', href: '#commission-disclosure' },
    { name: 'Disclaimer', href: '#disclaimer' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
    { name: 'WhatsApp', icon: Phone, href: '#', color: 'hover:text-green-500' }
  ];

  return (
    <footer className="bg-[#53755d] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Company Information */}
          <div className="lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">MFSPL</h3>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-yellow-50 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium">+91-989-474-9352</p>
                  <p className="text-xs sm:text-sm font-medium">+91-422-496-0352</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-yellow-50 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium">mf@mfspl.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-yellow-50 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    PO Box 160/27, 3rd Floor,<br />
                    Srinivasa Trade Center, DB Road,<br />
                    RS Puram, Coimbatore
                  </p>
                </div>
              </div>
            </div>

            {/* AMFI, SEBI, NSE Logos */}
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a 
                  href="https://www.amfiindia.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 hover:opacity-80 flex items-center justify-center"
                >
                  <img 
                    src={amfiLogo} 
                    alt="AMFI" 
                    className="w-[60px] h-[60px] object-contain"
                  />
                </a>
                <a 
                  href="https://www.sebi.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 hover:opacity-80 flex items-center justify-center"
                >
                  <img 
                    src={sebiLogo} 
                    alt="SEBI" 
                    className="w-[60px] h-[60px] object-contain"
                  />
                </a>
                <a 
                  href="https://www.nseindia.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 hover:opacity-80 flex items-center justify-center"
                >
                  <img 
                    src={nseLogo} 
                    alt="NSE" 
                    className="w-[60px] h-[60px] object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-green-100 hover:text-white transition-colors duration-200 flex items-center group text-xs sm:text-sm"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Our Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  {service.href.startsWith('#') ? (
                    <a 
                      href={service.href}
                      className="text-green-100 hover:text-white transition-colors duration-200 flex items-center group text-xs sm:text-sm"
                    >
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                      {service.name}
                    </a>
                  ) : (
                    <Link 
                      to={service.href}
                      className="text-green-100 hover:text-white transition-colors duration-200 flex items-center group text-xs sm:text-sm"
                    >
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                      {service.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Why Choose Us</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3e5d49] rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-white">Award Winning</h5>
                  <p className="text-xs text-green-100">Recognized excellence</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3e5d49] rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-white">Secure & Trusted</h5>
                  <p className="text-xs text-green-100">Your safety first</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3e5d49] rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-white">Expert Team</h5>
                  <p className="text-xs text-green-100">Professional guidance</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3e5d49] rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-white">Growth Focused</h5>
                  <p className="text-xs text-green-100">Maximize returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Social Media */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Connect With Us</h4>
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-[#3e5d49] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#3e5d49]/50 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-[#3e5d49] border border-green-900 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-transparent text-sm sm:text-base"
                />
                <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#53755d] font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#3e5d49] border-t border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-green-200 text-xs sm:text-sm">
                © {currentYear} MFSPL. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <a href="/privacy-policy" className="text-green-200 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="text-green-200 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#cookies" className="text-green-200 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
