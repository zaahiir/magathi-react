// src/pages/HomePage.js
import React from "react";
import EnhancedSliderWithNav from "../components/Header";
import AboutUs from "../components/AboutUs";
import Testimonial from "../components/Testimonial";

export default function HomePage() {
  return (
    <>
      <EnhancedSliderWithNav />
      <AboutUs />
      <Testimonial />
    </>
  );
}
