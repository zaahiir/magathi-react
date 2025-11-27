import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Clock, MapPin, Facebook, Twitter, Youtube, Send, MessageCircle, Building2, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import logo from "../assets/mfspl.png";

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Office Address",
      details: [
        "PO Box 160/27, 3rd Floor",
        "Srinivasa Trade Center, DB Road",
        "RS Puram, Coimbatore - 641002",
        "Tamil Nadu, India"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Numbers",
      details: [
        "+91-989-474-9352",
        "+91 422 4960352"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Address",
      details: [
        "mf@mfspl.com",
        "kannanrsbi@gmail.com"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Business Hours",
      details: [
        "Monday - Saturday: 9:00 AM - 6:00 PM",
        "Sunday: Closed"
      ],
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#53755d] via-[#4a6b56] to-[#3e5d49] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 backdrop-blur-sm">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent leading-tight">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Ready to start your financial journey? Let's discuss how we can help you achieve your goals with our expert guidance and personalized solutions.
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 text-sm md:text-base bg-white/20 backdrop-blur-md rounded-full px-6 md:px-8 py-3 md:py-4 inline-flex border border-white/30">
              <button onClick={() => navigate('/')} className="hover:text-green-200 transition-colors cursor-pointer font-medium">Home</button>
              <span className="text-green-200">/</span>
              <span className="text-green-200 font-semibold">Contact Us</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#53755d] transition-colors">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {info.title === "Phone Numbers" || info.title === "Email Address" ? (
                        <a 
                          href={info.title === "Phone Numbers" ? `tel:${detail}` : `mailto:${detail}`}
                          className="hover:text-[#53755d] transition-colors"
                        >
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Visit Our Office</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Located in the heart of Coimbatore's business district, our office is easily accessible and ready to welcome you for personalized consultations.
            </p>
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#53755d]/10 to-transparent"></div>
            <div className="relative h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.5!2d76.9!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb1%3A0x1b6c8c1c8c1c8c1c!2sRS%20Puram%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MFSPL Office Location - RS Puram, Coimbatore"
                className="rounded-3xl"
              ></iframe>
            </div>
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#53755d] rounded-full"></div>
                <p className="text-lg font-semibold text-gray-800">📍 RS Puram, Coimbatore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about our services? Want to schedule a consultation? Fill out the form below and we'll get back to you promptly.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#53755d] to-[#4a6b56] rounded-2xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Get Started Today</h3>
                </div>
                <p className="text-gray-600">We're here to help you make informed financial decisions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-16 bg-gradient-to-r from-[#53755d] to-[#4a6b56] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#53755d] to-[#4a6b56] rounded-3xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Why Choose Us?</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>20+ years of financial expertise</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Personalized investment strategies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Transparent and ethical practices</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Connect With Us</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <a href="#" className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center hover:bg-sky-600 transition-colors">
                      <Twitter className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center hover:bg-red-700 transition-colors">
                      <Youtube className="w-6 h-6 text-white" />
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Follow us on social media for the latest updates and financial insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;