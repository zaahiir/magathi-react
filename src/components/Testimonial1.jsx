import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Star, Quote } from 'lucide-react';

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "I am extremely satisfied with the services provided by Magathi Financial Services Pvt Ltd. Their team demonstrated exceptional expertise in understanding my financial needs and offered tailored solutions that exceeded my expectations.",
      name: "Nathan Felix",
      designation: "Director - Naxly Info tech",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      rating: 5,
      text: "The professional and personalized approach made me feel confident and secure in my investment decisions. Magathi's dedication to client satisfaction is truly commendable. I highly recommend their services to anyone seeking reliable and expert financial guidance.",
      name: "Sarah Johnson",
      designation: "CEO - Tech Solutions Inc",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      rating: 5,
      text: "Choosing Magathi Financial Services was one of the best decisions I've made for my financial planning. Their advisors are knowledgeable, approachable, and always ready to help.",
      name: "Michael Chen",
      designation: "Founder - Startup Ventures",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-[#53755d] via-[#4a6b54] to-[#3d5a47] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Sub Title */}
            <span className="inline-block text-yellow-50 text-sm md:text-base font-medium uppercase tracking-wider mb-4 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              Testimonials
            </span>
            
            {/* Main Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6 lg:mb-8">
              What Our Clients Say About Our 
              <span className="text-yellow-50 block">Professional Services</span>
            </h2>

            {/* Additional Info */}
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Discover why thousands of clients trust us with their financial planning and investment needs.
            </p>
          </div>

          {/* Right Content - Testimonial Slider */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              {/* Testimonial Cards */}
              <div className="relative min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex items-center justify-center">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`absolute inset-0 transition-all duration-1000 transform ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 translate-y-8'
                    }`}
                  >
                    <div className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
                      {/* Quote Icon */}
                      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-200">
                        <Quote className="w-8 h-8 md:w-12 md:h-12" />
                      </div>
                      
                      {/* Gradient Border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 p-[2px] -z-10">
                        <div className="bg-white rounded-3xl h-full w-full"></div>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex gap-1 mb-6 justify-center">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      {/* Testimonial Text */}
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 font-medium text-center italic">
                        "{testimonial.text}"
                      </p>
                      
                      {/* Author Info */}
                      <div className="flex items-center justify-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden ring-4 ring-yellow-100 shadow-lg">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                            {testimonial.name}
                          </h3>
                          <span className="text-gray-600 text-sm md:text-base">
                            {testimonial.designation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls - Desktop */}
              <div className="hidden lg:block absolute -left-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                {/* Vertical Line */}
                <div className="w-px h-20 bg-yellow-50 mb-4"></div>
                
                {/* Navigation Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-yellow-50 transition-all duration-300 flex items-center justify-center rounded-full border border-white/30"
                    aria-label="Previous testimonial"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-yellow-50 transition-all duration-300 flex items-center justify-center rounded-full border border-white/30"
                    aria-label="Next testimonial"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Controls - Mobile */}
              <div className="lg:hidden flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-yellow-50 transition-all duration-300 flex items-center justify-center rounded-full border border-white/30"
                  aria-label="Previous testimonial"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                
                {/* Slide Indicators */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-yellow-50 scale-125' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-yellow-50 transition-all duration-300 flex items-center justify-center rounded-full border border-white/30"
                  aria-label="Next testimonial"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;