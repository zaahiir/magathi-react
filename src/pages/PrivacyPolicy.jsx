import React, { useState } from 'react';
import Header from '../components/Header';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { 
  Shield, Eye, Lock, Database, UserCheck, AlertTriangle, Mail, Phone, MapPin, 
  ChevronDown, ChevronUp, FileText, Clock, Users, Settings, BarChart3,
  CheckCircle, XCircle, Info, ExternalLink
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
        <HeaderNav />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-[#53755d] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-[#53755d] max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#53755d]/10 backdrop-blur-sm rounded-2xl mb-8">
              <Shield className="w-10 h-10 text-[#53755d]" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-[#53755d] leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-[#53755d]/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Your Privacy Matters to Us - Transparent, Secure, and Compliant
            </p>
            <div className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 text-sm md:text-base">
              <a href="/" className="hover:text-[#53755d]/80 transition-colors px-4 py-2 rounded-full bg-[#53755d]/10 backdrop-blur-sm">
                Home
              </a>
              <span className="text-[#53755d]/70">/</span>
              <span className="text-white font-medium px-4 py-2 rounded-full bg-[#53755d]/30 backdrop-blur-sm">
                Privacy Policy
              </span>
            </div>
            </div>
            </div>
        </section>
      {/* Main Content */}
      <div className="">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-6">
                <h3 className="text-lg font-bold text-[#53755d] mb-6 flex items-center">
                  <FileText className="w-5 h-5 text-[#53755d] mr-2" />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {[
                    { id: 'introduction', label: 'Introduction', icon: Eye },
                    { id: 'data-controller', label: 'Data Controller', icon: Database },
                    { id: 'data-types', label: 'Data We Collect', icon: UserCheck },
                    { id: 'purposes', label: 'Purposes', icon: Lock },
                    { id: 'legal-basis', label: 'Legal Basis', icon: Settings },
                    { id: 'storage', label: 'Storage & Retention', icon: Clock },
                    { id: 'security', label: 'Security Measures', icon: Shield },
                    { id: 'rights', label: 'Your Rights', icon: CheckCircle },
                    { id: 'consent', label: 'Consent', icon: Users },
                    { id: 'sharing', label: 'Data Sharing', icon: BarChart3 },
                    { id: 'cookies', label: 'Cookies', icon: Info },
                    { id: 'dpo', label: 'Data Protection Officer', icon: Mail },
                    { id: 'updates', label: 'Policy Updates', icon: ExternalLink },
                    { id: 'contact', label: 'Contact Us', icon: Phone }
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center text-sm text-gray-600 hover:text-[#53755d] hover:bg-[#53755d]/10 px-3 py-2 rounded-lg transition-all duration-200 group"
                    >
                      <item.icon className="w-4 h-4 mr-3 group-hover:text-[#53755d]" />
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
          
          {/* Introduction */}
              <section id="introduction" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Introduction</h2>
                </div>
                <div className="prose prose-lg text-gray-700 leading-relaxed">
                  <p className="mb-6 text-lg">
                    At <span className="font-semibold text-[#53755d]">MFSPL (Mutual Fund Service Provider Limited)</span>, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store, and protect your personal information in compliance with India's Digital Personal Data Protection Act (DPDPA), 2023.
                  </p>
                  <div className="bg-[#53755d]/10 border-l-4 border-[#53755d] p-6 rounded-r-lg">
                    <p className="text-gray-700">
                This policy applies to all users of our website, mobile applications, and services. By using our services, you consent to the collection and use of your personal data as described in this policy.
              </p>
            </div>
          </div>
              </section>

          {/* Data Controller Information */}
              <section id="data-controller" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Data Controller Information</h2>
                </div>
                
                <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#53755d] mb-2">MFSPL - Mutual Fund Service Provider Limited</h3>
                    <p className="text-gray-600">Your trusted financial partner</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-[#53755d]/5 rounded-xl p-6 shadow-sm border border-[#53755d]/20">
                  <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <MapPin className="w-5 h-5 text-[#53755d]" />
                          </div>
                    <div>
                            <h4 className="font-semibold text-[#53755d] mb-2">Registered Address</h4>
                            <p className="text-gray-700 leading-relaxed">
                        PO Box 160/27, 3rd Floor,<br />
                        Srinivasa Trade Center, DB Road,<br />
                        RS Puram, Coimbatore - 641002<br />
                        Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-[#53755d]/5 rounded-xl p-6 shadow-sm border border-[#53755d]/20">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Mail className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#53755d] mb-2">Email Address</h4>
                            <p className="text-gray-700">mf@mfspl.com</p>
                          </div>
                    </div>
                  </div>
                      
                      <div className="bg-[#53755d]/5 rounded-xl p-6 shadow-sm border border-[#53755d]/20">
                  <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Phone className="w-5 h-5 text-[#53755d]" />
                          </div>
                    <div>
                            <h4 className="font-semibold text-[#53755d] mb-2">Phone Number</h4>
                            <p className="text-gray-700">+91-989-474-9352</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              </section>

          {/* Types of Personal Data Collected */}
              <section id="data-types" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Types of Personal Data We Collect</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                        <UserCheck className="w-5 h-5 text-[#53755d]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#53755d]">Identity Information</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Full name and title',
                        'Date of birth and age',
                        'Gender',
                        'PAN (Permanent Account Number)',
                        'Aadhaar number (where required for KYC)',
                        'Passport details (for NRI clients)',
                        'Photograph and signature'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                </ul>
              </div>

                  <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                        <Mail className="w-5 h-5 text-[#53755d]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#53755d]">Contact Information</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Email address',
                        'Mobile phone number',
                        'Residential address',
                        'Office address',
                        'Emergency contact details'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                </ul>
              </div>

                  <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                        <BarChart3 className="w-5 h-5 text-[#53755d]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#53755d]">Financial Information</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Bank account details',
                        'Income information',
                        'Investment preferences and risk profile',
                        'Transaction history',
                        'Tax-related information',
                        'Insurance details'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                </ul>
              </div>

                  <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                        <Settings className="w-5 h-5 text-[#53755d]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#53755d]">Technical Information</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'IP address and device information',
                        'Browser type and version',
                        'Operating system',
                        'Website usage patterns',
                        'Cookies and similar technologies',
                        'Location data (with consent)'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                </ul>
              </div>
            </div>
              </section>

          {/* Purposes of Data Collection */}
              <section id="purposes" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Purposes of Data Collection</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <Settings className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Service Provision</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Account creation and management',
                          'Investment advisory services',
                          'Transaction processing',
                          'Customer support'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <Shield className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Legal Compliance</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'KYC (Know Your Customer) requirements',
                          'Anti-money laundering checks',
                          'Tax reporting obligations',
                          'Regulatory compliance'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                  </ul>
                </div>
              </div>

                  <div className="space-y-6">
                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <Mail className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Communication</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Service updates and notifications',
                          'Marketing communications (with consent)',
                          'Educational content delivery',
                          'Newsletter subscriptions'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                  </ul>
                </div>

                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <BarChart3 className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Analytics & Improvement</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Website performance analysis',
                          'Service improvement',
                          'User experience enhancement',
                          'Security monitoring'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                  </ul>
                </div>
              </div>
            </div>
              </section>

          {/* Legal Basis for Processing */}
              <section id="legal-basis" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Legal Basis for Processing</h2>
                </div>
                
                <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                  <p className="text-lg text-[#53755d] mb-8 text-center">
                Under the <span className="font-bold text-[#53755d]">DPDPA, 2023</span>, we process your personal data based on the following legal grounds:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Consent',
                    description: 'When you explicitly consent to specific processing activities',
                    icon: CheckCircle
                  },
                  {
                    title: 'Contract Performance',
                    description: 'To fulfill our contractual obligations to you',
                    icon: Settings
                  },
                  {
                    title: 'Legal Obligation',
                    description: 'To comply with applicable laws and regulations',
                    icon: Shield
                  },
                  {
                    title: 'Legitimate Interest',
                    description: 'For our legitimate business interests, balanced against your privacy rights',
                    icon: BarChart3
                  },
                  {
                    title: 'Vital Interest',
                    description: 'To protect your vital interests or those of another person',
                    icon: AlertTriangle
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-[#53755d]/5 rounded-xl p-6 border-l-4 border-[#53755d]/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <item.icon className="w-5 h-5 text-[#53755d]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#53755d] mb-2">{item.title}</h3>
                        <p className="text-[#53755d]/90 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

              {/* Data Storage and Retention */}
              <section id="storage" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Data Storage and Retention</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                        <Database className="w-6 h-6 text-[#53755d]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#53755d]">Storage Location</h3>
                    </div>
                    <p className="text-[#53755d]/90 leading-relaxed text-lg">
                      Your personal data is primarily stored on <span className="font-semibold text-[#53755d]">secure servers located in India</span>. We ensure that any cross-border data transfers comply with applicable data protection laws.
                    </p>
                  </div>

                  <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-[#53755d]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#53755d]">Retention Periods</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { type: 'Account Information', period: '7 years after account closure or last transaction' },
                        { type: 'KYC Documents', period: '10 years as per regulatory requirements' },
                        { type: 'Transaction Records', period: '7 years for audit and compliance purposes' },
                        { type: 'Marketing Data', period: 'Until consent is withdrawn or 3 years of inactivity' },
                        { type: 'Technical Logs', period: '2 years for security and troubleshooting' }
                      ].map((item, index) => (
                        <div key={index} className="bg-[#53755d]/5 rounded-lg p-4 border border-[#53755d]/20">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#53755d]">{item.type}:</span>
                            <span className="text-sm px-3 py-1 rounded-full bg-[#53755d]/10 text-[#53755d]">
                              {item.period}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Measures */}
              <section id="security" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Security Measures</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <Settings className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Technical Safeguards</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'End-to-end encryption for data transmission',
                          'Secure socket layer (SSL) certificates',
                          'Regular security updates and patches',
                          'Multi-factor authentication',
                          'Intrusion detection systems'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Administrative Safeguards</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Access controls and role-based permissions',
                          'Regular staff training on data protection',
                          'Background checks for employees',
                          'Confidentiality agreements',
                          'Incident response procedures'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <Database className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Physical Safeguards</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Secure data centers with 24/7 monitoring',
                          'Biometric access controls',
                          'Fire suppression systems',
                          'Backup power systems',
                          'Secure disposal of physical records'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#53755d]/5 rounded-2xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <BarChart3 className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#53755d]">Organizational Safeguards</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Data protection impact assessments',
                          'Regular security audits',
                          'Vendor management programs',
                          'Business continuity planning',
                          'Privacy by design principles'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center text-[#53755d]/90">
                            <CheckCircle className="w-4 h-4 text-[#53755d] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section id="rights" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Your Rights Under DPDPA, 2023</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Right to Access',
                      description: 'You have the right to obtain confirmation of whether we process your personal data and access to that data, including information about the purposes of processing, categories of data, and recipients.',
                      icon: Eye
                    },
                    {
                      title: 'Right to Correction',
                      description: 'You can request correction of inaccurate or incomplete personal data. We will update your information promptly upon verification.',
                      icon: Settings
                    },
                    {
                      title: 'Right to Erasure',
                      description: 'You can request deletion of your personal data in certain circumstances, such as when the data is no longer necessary for the original purpose or when you withdraw consent.',
                      icon: XCircle
                    },
                    {
                      title: 'Right to Data Portability',
                      description: 'You can request a copy of your personal data in a structured, commonly used, and machine-readable format for transfer to another service provider.',
                      icon: ExternalLink
                    },
                    {
                      title: 'Right to Withdraw Consent',
                      description: 'You can withdraw your consent for data processing at any time. Withdrawal will not affect the lawfulness of processing based on consent before withdrawal.',
                      icon: AlertTriangle
                    },
                    {
                      title: 'Right to Grievance',
                      description: 'You have the right to file a complaint with the Data Protection Board of India if you believe your rights have been violated.',
                      icon: Shield
                    }
                  ].map((right, index) => (
                    <div key={index} className="bg-[#53755d]/5 text-[#53755d] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#53755d]/20">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                          <right.icon className="w-5 h-5 text-[#53755d]" />
                        </div>
                        <h3 className="text-xl font-bold">{right.title}</h3>
                      </div>
                      <p className="text-[#53755d]/90 leading-relaxed">{right.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Consent Mechanisms */}
              <section id="consent" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Consent Mechanisms</h2>
                </div>
                
                <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                  <h3 className="text-2xl font-bold text-[#53755d] mb-6 text-center">How We Obtain Consent</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Explicit Consent',
                        description: 'Clear, affirmative action through checkboxes, buttons, or similar mechanisms',
                        icon: CheckCircle
                      },
                      {
                        title: 'Granular Consent',
                        description: 'Separate consent for different processing activities',
                        icon: Settings
                      },
                      {
                        title: 'Easy Withdrawal',
                        description: 'Simple and accessible methods to withdraw consent',
                        icon: XCircle
                      },
                      {
                        title: 'Consent Records',
                        description: 'We maintain records of when and how consent was obtained',
                        icon: FileText
                      },
                      {
                        title: 'Regular Review',
                        description: 'Periodic review and renewal of consent where appropriate',
                        icon: Clock
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-[#53755d]/5 rounded-xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <item.icon className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#53755d] mb-2">{item.title}</h4>
                            <p className="text-[#53755d]/90 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="sharing" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Data Sharing and Third Parties</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-[#53755d]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#53755d]">When We Share Your Data</h3>
                    </div>
                    <ul className="space-y-4">
                      {[
                        'With mutual fund companies for investment processing',
                        'With banks and financial institutions for transaction processing',
                        'With regulatory authorities as required by law',
                        'With service providers under strict data protection agreements',
                        'With your explicit consent for specific purposes'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-[#53755d]/90">
                          <CheckCircle className="w-5 h-5 text-[#53755d] mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                        <XCircle className="w-6 h-6 text-[#53755d]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#53755d]">We Never Sell Your Data</h3>
                    </div>
                    <p className="text-[#53755d]/90 leading-relaxed text-lg">
                      We do not sell, rent, or trade your personal data to third parties for marketing purposes. Your data is only shared as necessary for service provision or legal compliance.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies and Tracking */}
              <section id="cookies" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Info className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Cookies and Tracking Technologies</h2>
                </div>
                
                <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                  <h3 className="text-2xl font-bold text-[#53755d] mb-8 text-center">Types of Cookies We Use</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      {
                        title: 'Essential Cookies',
                        description: 'Necessary for website functionality, security, and basic features. These cannot be disabled.',
                        icon: Shield
                      },
                      {
                        title: 'Analytics Cookies',
                        description: 'Help us understand how visitors interact with our website to improve user experience.',
                        icon: BarChart3
                      },
                      {
                        title: 'Preference Cookies',
                        description: 'Remember your choices and preferences for a personalized experience.',
                        icon: Settings
                      },
                      {
                        title: 'Marketing Cookies',
                        description: 'Used to deliver relevant advertisements and measure campaign effectiveness (with consent).',
                        icon: Mail
                      }
                    ].map((cookie, index) => (
                      <div key={index} className="bg-[#53755d]/5 rounded-xl p-6 border-l-4 border-[#53755d]/50 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-3">
                            <cookie.icon className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <h4 className="text-lg font-bold text-[#53755d]">{cookie.title}</h4>
                        </div>
                        <p className="text-[#53755d]/90 text-sm leading-relaxed">{cookie.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Data Protection Officer */}
              <section id="dpo" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Data Protection Officer (DPO)</h2>
                </div>
                
                <div className="bg-[#53755d]/5 text-[#53755d] rounded-2xl p-8 border border-[#53755d]/20">
                  <h3 className="text-3xl font-bold mb-8 text-center">Contact Our Data Protection Officer</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#53755d]/5 backdrop-blur-sm rounded-2xl p-6">
                      <h4 className="text-2xl font-bold mb-6 flex items-center">
                        <Users className="w-6 h-6 mr-3" />
                        Grievance Officer
                      </h4>
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Mail className="w-6 h-6 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">Email:</p>
                            <p className="text-[#53755d]/90 text-lg">dpo@mfspl.com</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <Phone className="w-6 h-6 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">Phone:</p>
                            <p className="text-[#53755d]/90 text-lg">+91-989-474-9352</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <MapPin className="w-6 h-6 text-[#53755d]" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">Address:</p>
                            <p className="text-[#53755d]/90 leading-relaxed">
                              PO Box 160/27, 3rd Floor,<br />
                              Srinivasa Trade Center, DB Road,<br />
                              RS Puram, Coimbatore - 641002
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#53755d]/5 backdrop-blur-sm rounded-2xl p-6">
                      <h4 className="text-2xl font-bold mb-6 flex items-center">
                        <Clock className="w-6 h-6 mr-3" />
                        Response Information
                      </h4>
                      <div className="space-y-6">
                        <div>
                          <h5 className="text-xl font-semibold mb-3">Response Time</h5>
                          <p className="text-[#53755d]/90 text-lg leading-relaxed">
                            We will respond to your data protection inquiries within <span className="font-bold">30 days</span> of receipt.
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xl font-semibold mb-3">Complaint Process</h5>
                          <p className="text-[#53755d]/90 text-lg leading-relaxed">
                            If you're not satisfied with our response, you can file a complaint with the <span className="font-bold">Data Protection Board of India</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Updates to Policy */}
              <section id="updates" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <ExternalLink className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Updates to This Policy</h2>
                </div>
                
                <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                  <p className="text-lg text-[#53755d] mb-8 text-center">
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes through:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { method: 'Email notification to your registered email address', icon: Mail },
                      { method: 'Prominent notice on our website', icon: Eye },
                      { method: 'In-app notifications for mobile users', icon: Settings },
                      { method: 'Updated policy with clear version date', icon: FileText }
                    ].map((item, index) => (
                      <div key={index} className="bg-[#53755d]/5 rounded-xl p-6 border border-[#53755d]/20 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#53755d]/10 rounded-lg flex items-center justify-center mr-4">
                            <item.icon className="w-5 h-5 text-[#53755d]" />
                          </div>
                          <p className="text-[#53755d] font-medium">{item.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-[#53755d]/5 rounded-xl p-6 border border-[#53755d]/20">
                    <p className="text-[#53755d] text-lg text-center">
                      Continued use of our services after such changes constitutes acceptance of the updated policy.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="bg-white rounded-2xl shadow-xl border border-[#53755d]/20 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#53755d]/10 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-[#53755d]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#53755d]">Contact Us</h2>
                </div>
                
                <div className="bg-[#53755d]/5 rounded-2xl p-8 border border-[#53755d]/20">
                  <h3 className="text-3xl font-bold text-[#53755d] mb-8 text-center">Questions About This Privacy Policy?</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#53755d]/5 rounded-2xl p-8 shadow-lg">
                      <h4 className="text-2xl font-bold text-[#53755d] mb-6 flex items-center">
                        <Mail className="w-6 h-6 text-[#53755d] mr-3" />
                        General Inquiries
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-[#53755d]/5 rounded-lg">
                          <Mail className="w-5 h-5 text-[#53755d] mr-3" />
                          <span className="text-[#53755d] font-medium">mf@mfspl.com</span>
                        </div>
                        <div className="flex items-center p-4 bg-[#53755d]/5 rounded-lg">
                          <Phone className="w-5 h-5 text-[#53755d] mr-3" />
                          <span className="text-[#53755d] font-medium">+91-989-474-9352</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#53755d]/5 rounded-2xl p-8 shadow-lg">
                      <h4 className="text-2xl font-bold text-[#53755d] mb-6 flex items-center">
                        <Shield className="w-6 h-6 text-[#53755d] mr-3" />
                        Data Protection Concerns
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-[#53755d]/5 rounded-lg">
                          <Mail className="w-5 h-5 text-[#53755d] mr-3" />
                          <span className="text-[#53755d] font-medium">dpo@mfspl.com</span>
                        </div>
                        <div className="flex items-center p-4 bg-[#53755d]/5 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-[#53755d] mr-3" />
                          <span className="text-[#53755d] font-medium">24/7 Security Hotline</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Legal Disclaimer */}
              <div className="bg-[#53755d]/5 border-l-4 border-[#53755d]/50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#53755d] mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Legal Disclaimer
                </h3>
                <p className="text-[#53755d]/90 text-lg leading-relaxed">
                  This Privacy Policy is provided for informational purposes and does not constitute legal advice. 
                  For specific legal questions regarding data protection, please consult with a qualified legal professional. 
                  This policy is subject to Indian law and the jurisdiction of Indian courts.
                </p>
              </div>
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
