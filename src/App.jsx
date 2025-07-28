import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Calculator from "./pages/Calculator";
import Loader from "./pages/Loader";
import AboutUs from "./components/AboutUs";
import ChatBot from "./pages/ChatBot";

const AppRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timeout);
  }, [location]);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/chatbot" element={<ChatBot />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}


