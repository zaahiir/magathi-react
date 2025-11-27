import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

const FinancialChatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      from: "bot",
      text: "Hi! Ask me anything about mutual funds or financial planning.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const GEMINI_API_KEY = "AIzaSyDnRaQO-tm_1x-S1uKRLtkLYzeIs_0jAl0";

  // Test API connection on mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("Testing Gemini API connection...");
        console.log(" Using API Key:", GEMINI_API_KEY.substring(0, 10) + "...");
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: "Hello, are you working?"
                    }
                  ]
                }
              ]
            }),
          }
        );

        console.log("📡 Test API Response Status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Gemini API is working correctly");
          console.log("Test response:", data);
          
          // Test if we can extract the answer
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const testAnswer = data.candidates[0].content.parts[0].text;
            console.log("Test answer extracted:", testAnswer);
          }
        } else {
          const errorText = await response.text();
          console.log("Gemini API test failed:", response.status);
          console.log("Error details:", errorText);
          
          // Try to parse error
          try {
            const errorData = JSON.parse(errorText);
            console.log("Parsed error:", errorData);
          } catch (e) {
            console.log("Raw error text:", errorText);
          }
        }
      } catch (error) {
        console.log("Gemini API test error:", error.message);
        console.log("Full error:", error);
      }
    };

    testAPI();
  }, []);

  // Auto scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question) return;

    setChatHistory((prev) => [...prev, { from: "user", text: question }]);
    setChatInput("");
    setLoading(true);

    try {
      const botReply = await fetchFinancialAnswer(question);
      setChatHistory((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I'm here to help with financial questions! You can ask me about mutual funds, investments, financial planning, SIP, risk management, or any other financial topics.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialAnswer = async (question) => {
    try {
      console.log("Sending question to Gemini API:", question);

      // Create a more specific prompt for better responses
      const prompt = `You are a helpful financial advisor chatbot. Please provide a clear, informative response to this question: "${question}". Keep your response concise but helpful.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          }),
        }
      );

      console.log("📡 API Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        // Try to parse error details
        try {
          const errorData = JSON.parse(errorText);
          console.error("API Error Details:", errorData);
        } catch (e) {
          console.error("Raw error text:", errorText);
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full API Response:", data);

      // Check if we have a valid response
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        const answer = data.candidates[0].content.parts[0].text.trim();
        console.log("Got real answer from API:", answer);
        return answer;
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      // Use fallback response
      return getFallbackResponse(question);
    }
  };

  const getFallbackResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('react')) {
      return "React.js is a popular JavaScript library for building user interfaces. It's component-based and allows fast rendering using a virtual DOM.";
    }

    if (lowerQuestion.includes('mutual fund')) {
      if (lowerQuestion.includes('risk')) {
        return "Mutual fund risks include market risk, credit risk, and interest rate risk. Diversification can help mitigate some of these risks.";
      }
      if (lowerQuestion.includes('invest')) {
        return "To invest in mutual funds: 1) Select a fund, 2) Complete KYC, 3) Invest via SIP or lump sum, and 4) Monitor your investments regularly.";
      }
      return "Mutual funds are investment vehicles that pool investor money to invest in diversified assets like stocks or bonds.";
    }

    if (lowerQuestion.includes('invest')) {
      return "Investment involves allocating money to assets like stocks, bonds, or mutual funds for future returns. Always align investments with your goals.";
    }

    if (lowerQuestion.includes('financial planning')) {
      return "Financial planning includes budgeting, saving, investing, and setting financial goals to secure your future.";
    }

    if (lowerQuestion.includes('sip')) {
      return "SIP (Systematic Investment Plan) lets you invest fixed amounts regularly into mutual funds. It's a great way to build wealth slowly.";
    }

    if (lowerQuestion.includes('risk')) {
      return "Risk varies by investment. Equities offer higher returns but are volatile. Safer options include bonds and fixed deposits.";
    }

    if (lowerQuestion.includes('return')) {
      return "Returns depend on market performance and the type of investment. Past performance does not guarantee future results.";
    }

    return "I'm here to help with financial questions! You can ask me about mutual funds, investments, SIP, planning, or React.js too.";
  };

  const clearChat = () => {
    setChatHistory([
      {
        from: "bot",
        text: "Hi! Ask me anything about mutual funds or financial planning.",
      },
    ]);
  };

  // Manual API test function
  const testAPIManually = async () => {
    try {
      console.log("Manual API Test...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "What is React.js?"
                  }
                ]
              }
            ]
          }),
        }
      );

      console.log("📡 Manual test status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Manual test successful:", data);
        alert("API is working! Check console for details.");
      } else {
        const errorText = await response.text();
        console.log("❌ Manual test failed:", errorText);
        alert("API failed! Check console for details.");
      }
    } catch (error) {
      console.log("❌ Manual test error:", error);
      alert("API error! Check console for details.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div
        className="fixed bottom-5 right-5 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center gap-2"
        onClick={() => setShowChatbot(true)}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Ask Question</span>
      </div>

      {/* Chatbot UI */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 bg-black/20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-700 text-sm">
                  Financial Chatbot
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm font-semibold px-2 py-1 rounded transition"
                  onClick={testAPIManually}
                  title="Test API"
                >
                  Test API
                </button>
                <button
                  className="text-green-500 hover:text-green-700 text-sm font-semibold px-2 py-1 rounded transition"
                  onClick={clearChat}
                  title="Clear Conversation"
                >
                  Clear
                </button>
                <button
                  className="text-gray-400 hover:text-red-500 text-xl font-bold"
                  onClick={() => setShowChatbot(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
              style={{ maxHeight: 300 }}
              ref={chatContainerRef}
            >
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-green-100 text-green-900"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-lg text-sm bg-green-600 text-white animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleChatSubmit}
              className="flex items-center border-t p-2 gap-2"
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded hover:from-green-600 hover:to-green-800 transition text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FinancialChatbot;
