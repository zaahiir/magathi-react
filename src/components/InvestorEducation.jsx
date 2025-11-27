import React, { useState } from "react";
import { ChevronDown, BookOpen, TrendingUp, Calculator, Shield } from "lucide-react";

const guidelines = [
  {
    title: "1. Investor Education/Resources/Blog",
    content:
      "This means that there are articles, videos, or websites to help people learn more about investing and how to manage their money better.",
    icon: BookOpen
  },
  {
    title:
      "2. Empower investors with knowledge and meet regulatory expectations",
    content:
      "Empower means to help people understand investing. Rules also want everyone to be properly informed to make safe choices.",
    icon: TrendingUp
  },
  {
    title:
      "3. Articles on investment concepts, mutual fund basics, financial literacy, market dynamics",
    content:
      "These articles help people understand basic things like how mutual funds work, how to save and grow money, and how markets behave.",
    icon: BookOpen
  },
  {
    title: "4. Explanation of goal-based investing via SIPs/lumpsum in MFs",
    content:
      "Goal-based investing means saving money for a purpose like buying a house. SIP means investing bit-by-bit, and lumpsum means putting all money at once.",
    icon: TrendingUp
  },
  {
    title:
      "5. Tools like calculators (with clear disclaimers against guaranteed returns)",
    content:
      "Tools like calculators help guess how much money you might make, but must clearly say there is no guarantee of profit.",
    icon: Calculator
  },
  {
    title: "6. SEBI/AMFI investor awareness material",
    content:
      "SEBI and AMFI are rule-making bodies. They provide learning material to help people invest safely and smartly.",
    icon: Shield
  },
  {
    title:
      "7. No scheme-specific recommendations without risk profiling",
    content:
      "No one should tell you to invest in a specific plan unless they know your risk level — like how much risk you're okay with.",
    icon: Shield
  },
  {
    title: "8. No misleading info or guaranteed returns",
    content:
      "Don't tell people they'll definitely make money. Investing always has some risk.",
    icon: Shield
  },
  {
    title: "9. No 'free advice' as inducement",
    content:
      "Don't give free advice just to get someone to invest. That's like a trick and is not allowed.",
    icon: Shield
  },
];

export default function InvestorEducation() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#53755d] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-4 sm:mb-6 shadow-lg">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-[#53755d]" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">
            Investor Education Guidelines
          </h1>
          <p className="text-base sm:text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
            Comprehensive guidelines to empower smart investing decisions
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3 sm:space-y-4">
          {guidelines.map((item, index) => {
            const IconComponent = item.icon;
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Accordion Button */}
                <button
                  className="w-full flex items-center justify-between px-4 cursor-pointer sm:px-6 py-4 sm:py-6 text-left focus:outline-none focus:ring-2 focus:ring-[#53755d] focus:ring-opacity-50 rounded-xl sm:rounded-2xl transition-all duration-300"
                  onClick={() => toggleIndex(index)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`flex-shrink-0 p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                      isOpen 
                        ? 'bg-[#53755d] text-white shadow-md' 
                        : 'bg-gray-100 text-[#53755d] hover:bg-gray-200'
                    }`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`font-semibold text-sm sm:text-base lg:text-lg transition-colors duration-300 ${
                      isOpen ? 'text-[#53755d]' : 'text-gray-800'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  
                  <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                    isOpen ? 'rotate-180 text-[#53755d]' : 'rotate-0 text-gray-500'
                  }`}>
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="ml-12 sm:ml-16 pr-8 sm:pr-12">
                      <div className="h-px bg-gradient-to-r from-[#53755d] to-transparent mb-4 sm:mb-6"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}