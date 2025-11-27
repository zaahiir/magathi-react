import React, { useState, useRef, useEffect } from "react";

const PRIMARY_COLOR = "#53755d";

const termsSections = [
  {
    title: "1. Investment Risks and Disclaimers",
    content:
      "All investments carry inherent risks. Past performance does not guarantee future results. The value of investments can go up or down, and you may get back less than you invested. We strongly recommend consulting with a qualified financial advisor before making any investment decisions.",
  },
  {
    title: "2. No Guaranteed Returns",
    content:
      "We do not guarantee any specific returns on investments. Market conditions are unpredictable and can affect investment performance. All investment decisions should be based on thorough research and understanding of the associated risks.",
  },
  {
    title: "3. Regulatory Compliance",
    content:
      "All investment activities are subject to applicable laws and regulations. We are committed to maintaining compliance with SEBI guidelines and other regulatory requirements. Users must ensure their investment activities comply with local regulations.",
  },
  {
    title: "4. Information Accuracy",
    content:
      "While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness or accuracy of all data presented. Users should verify information independently before making investment decisions.",
  },
  {
    title: "5. User Responsibilities",
    content:
      "Users are responsible for their own investment decisions and should conduct their own research. We are not liable for any losses resulting from investment decisions made based on information provided on this platform.",
  },
  {
    title: "6. Privacy and Data Protection",
    content:
      "We are committed to protecting your personal and financial information. All data is handled in accordance with applicable privacy laws and our privacy policy. We do not share your information with unauthorized third parties.",
  },
];

function PlusMinusIcon({ open }) {
  return open ? (
    // Minus icon
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="6" y="13" width="16" height="2" rx="1" fill={PRIMARY_COLOR} />
    </svg>
  ) : (
    // Plus icon
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="6" y="13" width="16" height="2" rx="1" fill={PRIMARY_COLOR} />
      <rect x="13" y="6" width="2" height="16" rx="1" fill={PRIMARY_COLOR} />
    </svg>
  );
}

export default function TermsAndConditions() {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  // Disclaimer consent bar state
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem("disclaimerAccepted") === "true";
  });

  useEffect(() => {
    if (disclaimerAccepted) {
      localStorage.setItem("disclaimerAccepted", "true");
    }
  }, [disclaimerAccepted]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.terms-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // For smooth height animation
  useEffect(() => {
    contentRefs.current.forEach((ref, idx) => {
      if (ref) {
        if (openIndex === idx) {
          ref.style.maxHeight = ref.scrollHeight + "px";
        } else {
          ref.style.maxHeight = "0px";
        }
      }
    });
  }, [openIndex]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #e8f5e9 0%, #f5f5f5 100%)",
      }}
    >
      {/* Cookie-style Disclaimer Consent Bar */}
      {!disclaimerAccepted && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 flex justify-center items-end px-2 py-4"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-lg border flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-4"
            style={{ borderColor: PRIMARY_COLOR, boxShadow: "0 4px 24px 0 rgba(83,117,93,0.13)" }}
          >
            <div className="flex-1 text-sm text-gray-800">
              <span className="font-semibold text-base" style={{ color: PRIMARY_COLOR }}>
                Mutual Fund Disclaimer:
              </span>
              <br />
              Mutual fund investments are subject to market risks, including the possible loss of principal. Read all scheme-related documents carefully before investing. Past performance is not indicative of future results. The information provided here does not constitute investment advice and is for informational purposes only. Please consult your financial advisor before making investment decisions.
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 min-w-[180px] md:min-w-[220px]">
              <button
                className="w-full py-2 px-4 rounded-lg font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                onClick={() => {
                  setDisclaimerAccepted(true);
                  localStorage.setItem("disclaimerAccepted", "false");
                }}
              >
                Decline All
              </button>
              <button
                className="w-full py-2 px-4 rounded-lg font-semibold text-white"
                style={{ background: PRIMARY_COLOR, letterSpacing: "0.5px" }}
                onClick={() => setDisclaimerAccepted(true)}
              >
                Accept and close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End Cookie-style Disclaimer Consent Bar */}
      <div className="w-full max-w-3xl mx-auto terms-section">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-[#53755d] text-sm font-medium bg-[#53755d]/10 px-4 py-2 rounded-full">Terms & Conditions</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">Please read these important points before using our platform.</h2>
            </div>
          </div>
        <div className="space-y-5">
          {termsSections.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200 transition-all"
                style={{
                  boxShadow: isOpen
                    ? `0 8px 32px 0 rgba(83,117,93,0.15)`
                    : "0 2px 8px 0 rgba(83,117,93,0.07)",
                  borderColor: isOpen ? PRIMARY_COLOR : "#e0e0e0",
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 focus:outline-none transition-all"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    background: isOpen
                      ? "rgba(83,117,93,0.07)"
                      : "transparent",
                    borderRadius: "1rem",
                  }}
                >
                  <span
                    className="font-semibold text-lg"
                    style={{
                      color: isOpen ? PRIMARY_COLOR : "#222",
                      transition: "color 0.3s",
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="ml-4 flex-shrink-0"
                    style={{
                      transition: "transform 0.3s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <PlusMinusIcon open={isOpen} />
                  </span>
                </button>
                <div
                  ref={(el) => (contentRefs.current[idx] = el)}
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isOpen ? "500px" : "0px",
                    opacity: isOpen ? 1 : 0.5,
                  }}
                >
                  <div className="px-6 pb-6 pt-1 text-gray-700 text-base leading-relaxed">
                    {item.content}
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