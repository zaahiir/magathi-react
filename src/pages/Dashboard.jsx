import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/mfspl.png";
import ProfileHeader from "../components/ProfileHeader";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(res.data.message);
      } catch (err) {
        navigate("/login");
      }
    };
    verify();
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#53755d] via-[#6b8a6b] to-[#8aab8a]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Consistent Profile Header */}
          <ProfileHeader 
            variant="page"
            showActions={true}
            onEditProfile={() => navigate("/profile")}
            onLogout={handleLogout}
          />

          {/* Dashboard Content */}
          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logo} alt="Magathi Logo" className="h-20 w-auto mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-[#53755d]">Magathi Financial Services</h1>
              <p className="text-gray-600 mt-2">Dashboard</p>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome back!
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
