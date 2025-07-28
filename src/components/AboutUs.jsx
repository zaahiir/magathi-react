import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import rupeeCoin from "../assets/coins.png";
import rupeeNote from "../assets/coin.png";

const points = [
  "Expert guidance for mutual fund investments",
  "Transparent and simplified process",
  "Wide range of fund options",
  "Personalized portfolio recommendations",
  "Regular portfolio reviews and updates",
];

const tickIconBg =
  "bg-gradient-to-br from-green-500 to-green-900 flex items-center justify-center w-8 h-8 mr-3 rounded-[52%_48%_46%_54%_/_26%_49%_51%_74%]";

const AboutUs = () => {
  const { scrollY } = useScroll();

  const noteX = useTransform(scrollY, [0, 800], [-200, 200]);
  const coinX = useTransform(scrollY, [0, 800], [200, -200]);
  const imgY = useTransform(scrollY, [0, 600], [-60, 60]);
  const contentY = useTransform(scrollY, [0, 600], [60, -60]);

  return (
    <section className="text-black py-20 relative overflow-hidden">
      <motion.img
        src={rupeeNote}
        alt="Rupee Note"
        className="absolute top-20 left-0 w-40 opacity-80"
        style={{ x: noteX }}
      />
      <motion.img
        src={rupeeCoin}
        alt="Rupee Coin"
        className="absolute bottom-10 right-0 w-32 opacity-80"
        style={{ x: coinX }}
      />

      <div className="container mx-auto px-6 md:px-10 lg:px-20 flex flex-col md:flex-row items-center md:items-start">
        {/* Left: Image with parallax */}
        <motion.div
          className="w-full md:w-4/12 flex justify-center md:justify-start mb-10 md:mb-0"
          style={{ y: imgY }}
        >
          {/* <img
            src={rupeeCoin}
            alt="Rupee Coin"
            className="w-40 md:w-56 lg:w-64 opacity-90"
          /> */}
        </motion.div>
        {/* Right: Content with parallax */}
        <motion.div
          className="w-full md:w-7/12 md:pl-10"
          style={{ y: contentY }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center md:text-left">
            About Us
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-6 text-center md:text-left">
            We are a trusted Mutual Fund Distributor (MFD) committed to providing
            simplified and transparent investment solutions. Our goal is to help
            you build wealth systematically through carefully selected mutual fund
            products.
          </p>
          <ul className="space-y-5 mt-6">
            {points.map((point, idx) => (
              <li key={idx} className="flex items-center text-left">
                <span className={tickIconBg}>
                  {/* Tick SVG */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M5 9.5L8 12.5L13 7.5"
                      stroke="#ffffffff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-base md:text-lg">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
