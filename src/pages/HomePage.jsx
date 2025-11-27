import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import EnhancedSliderWithNav from "../components/Header";
import AboutUs from "../components/AboutUs";
import Testimonial from "../components/Testimonial";
// import InvestorEducation from "../components/InvestorEducation";
import ScatterChart from "../components/ScatterChart";
import TermsAndConditions from "../components/TermsAndConditions";
import Counter from "../components/Counter";
import ServicesSection from "../components/ServicesSection";
import IndustriesSection from "../components/IndustriesSection";
import Footer from "../components/Footer";
import Contact from "../components/Contact";
import Testimonial1 from "../components/Testimonial1";
import { FaHeart } from "react-icons/fa";



export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user just logged in and show welcome message
    if (isAuthenticated && user) {
      // Check if this is a fresh login by looking for a flag in sessionStorage
      const hasShownWelcome = sessionStorage.getItem('welcomeShown');
      
      if (!hasShownWelcome) {
        toast.success(`Welcome to Magathi${user?.firstName ? `, ${user.firstName}` : ''}! ❤️`, {
          icon: <FaHeart className="text-lg" />
        });
        sessionStorage.setItem('welcomeShown', 'true');
      }
    }
  }, [isAuthenticated, user]);

  return (
    <>

      <EnhancedSliderWithNav />
      <AboutUs />
      <Counter />
      {/* <InvestorEducation /> */}
      <ServicesSection />
      <IndustriesSection />
      {/* <ScatterChart /> */}
      <TermsAndConditions />
      <Testimonial1 />
      <Contact />
      <Footer />
    </>
  );
}
