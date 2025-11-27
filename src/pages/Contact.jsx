import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Clock, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';
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
    subject: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Message sent successfully! We'll get back to you soon.");

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: ''
        });
        setErrors({});
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNav />

      {/* Page Title Section */}
      <section className="relative py-24 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/src/assets/banner-1.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Get in touch with our team for personalized financial solutions and expert guidance
            </p>
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              <button onClick={() => navigate('/')} className="hover:text-green-300 transition-colors cursor-pointer">Home</button>
              <span className="text-gray-400">/</span>
              <span className="text-green-300 font-medium">Contact Us</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Location & Map Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Location</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visit our office for personalized financial consultation and expert advice
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Address Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-8 h-8 text-[#53755d]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Office Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    PO Box 160/27, 3rd Floor,<br />
                    Srinivasa Trade Center, DB Road,<br />
                    RS Puram, Coimbatore - 641002<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Phone className="w-8 h-8 text-[#53755d]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Numbers</h3>
                  <p className="text-gray-600">
                    <a href="tel:+919894749352" className="hover:text-[#53755d] transition-colors">+91-989-474-9352</a><br />
                    <a href="tel:+914224960352" className="hover:text-[#53755d] transition-colors">+91 422 4960352</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Mail className="w-8 h-8 text-[#53755d]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Address</h3>
                  <p className="text-gray-600">
                    <a href="mailto:mf@mfspl.com" className="hover:text-[#53755d] transition-colors">mf@mfspl.com</a><br />
                    <a href="mailto:kannanrsbi@gmail.com" className="hover:text-[#53755d] transition-colors">kannanrsbi@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-[#53755d]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="relative">
              <div className="bg-gray-200 rounded-xl overflow-hidden shadow-lg h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.5!2d76.9!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb1%3A0x1b6c8c1c8c1c8c1c!2sRS%20Puram%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MFSPL Office Location - RS Puram, Coimbatore"
                ></iframe>
              </div>
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-gray-800">📍 RS Puram, Coimbatore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-20 px-4 md:px-32 bg-gray-50">
        {/* Background Elements */}
        <div className="absolute left-0 top-0 w-full md:w-1/2 h-1/2 bg-gray-100"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="bg-[#53755d] rounded-3xl rounded-br-none overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left Side - Contact Info */}
              <div className="relative p-8 lg:p-12 flex flex-col justify-between">

                {/* Header */}
                <div className="mb-8">
                  <span className="text-green-200 text-sm uppercase tracking-wider mb-2 block">APPOINTMENT</span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                    Send your Proposal to us
                  </h2>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="flex items-center text-white">
                    <Clock className="w-8 h-8 mr-4" />
                    <div>
                      <h6 className="text-sm uppercase font-semibold mb-1 text-green-200">OFF HRS</h6>
                      <h4 className="text-lg font-semibold">Mon - Sat: 09am to 06pm</h4>
                    </div>
                  </div>

                  <div className="flex items-center text-white">
                    <Phone className="w-8 h-8 mr-4" />
                    <div>
                      <h6 className="text-sm uppercase font-semibold mb-1 text-green-200">PHONE</h6>
                      <h4 className="text-lg font-semibold">
                        <a href="tel:+919894749352" className="hover:underline">+91-989-474-9352</a>
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center text-white">
                    <Mail className="w-8 h-8 mr-4" />
                    <div>
                      <h6 className="text-sm uppercase font-semibold mb-1 text-green-200">EMAIL</h6>
                      <h4 className="text-lg font-semibold">
                        <a href="mailto:mf@mfspl.com" className="hover:underline">mf@mfspl.com</a>
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-8 mt-8">
                  <a href="#" className="text-white hover:text-green-200 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <a href="#" className="text-white hover:text-green-200 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <a href="#" className="text-white hover:text-green-200 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>

                {/* Circular Background Element */}
                <div className="absolute -right-96 -bottom-52 w-[770px] h-[770px] bg-yellow-50 rounded-full opacity-10"></div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8 lg:p-0">
                <div className="bg-white rounded-3xl rounded-br-none h-full p-8 lg:p-10 relative z-10">
                     {/* Logo */}
                <div className="mb-20">
                  <img src={logo} alt="MFSPL Logo" className="h-12 w-20" />
                </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name *"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className={`w-full h-14 px-5 bg-gray-100 rounded-2xl rounded-br-none border text-[#333333] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.firstName 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-100 focus:ring-green-500'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1 ml-2">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name *"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className={`w-full h-14 px-5 bg-gray-100 rounded-2xl rounded-br-none border text-[#333333] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.lastName 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-100 focus:ring-green-500'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1 ml-2">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full h-14 px-5 bg-gray-100 rounded-2xl rounded-br-none border text-[#333333] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.email 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-100 focus:ring-green-500'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1 ml-2">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="subject"
                          placeholder="Subject *"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className={`w-full h-14 px-5 bg-gray-100 rounded-2xl rounded-br-none border text-[#333333] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.subject 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-100 focus:ring-green-500'
                          }`}
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-sm mt-1 ml-2">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full h-14 px-5 bg-gray-100 rounded-2xl rounded-br-none border text-[#333333] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.phone 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-100 focus:ring-green-500'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.phone}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white font-semibold py-4 px-8 rounded-2xl rounded-br-none transition-all duration-300 transform ${
                          isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#53755d] hover:bg-[#3e5d49] hover:scale-105 cursor-pointer'
                        }`}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Request'}
                      </button>
                    </div>
                  </form>
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






