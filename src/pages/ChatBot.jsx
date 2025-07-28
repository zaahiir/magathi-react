import React, { useState } from "react";
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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question) return;

    setChatHistory((prev) => [...prev, { from: "user", text: question }]);
    setChatInput("");
    setLoading(true);

    // Simulate an API response (replace this with a real fetch function)
    const botReply = await fetchFinancialAnswer(question);

    setChatHistory((prev) => [...prev, { from: "bot", text: botReply }]);
    setLoading(false);
  };

  const fetchFinancialAnswer = async (question) => {
    // You can replace this with a real API call to ChatGPT, AMFI, or Google CSE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Here's an informative response to: "${question}". For detailed advice, always consult a certified financial advisor.`);
      }, 1200);
    });
  };

  const clearChat = () => {
    setChatHistory([
      {
        from: "bot",
        text: "Hi! Ask me anything about mutual funds or financial planning.",
      },
    ]);
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
                <span className="font-bold text-green-700 text-sm">Financial Chatbot</span>
              </div>
              <div className="flex items-center gap-2">
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
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: 300 }}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
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
            <form onSubmit={handleChatSubmit} className="flex items-center border-t p-2 gap-2">
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
