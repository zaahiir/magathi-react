import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Google from "../assets/google.png";

// Simple Snackbar component
function Snackbar({ message, color, onClose }) {
  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white font-semibold z-50 transition-all duration-300 ${
        color === "green" ? "bg-green-600" : "bg-red-600"
      }`}
      role="alert"
    >
      {message}
      <button
        className="ml-4 text-white font-bold"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "" });
  const navigate = useNavigate();

  // Example: Only allow this email/password as valid
  const validCredentials = {
    email: "test@example.com",
    password: "Password123"
  };

  const handleGoogleSignIn = () => {
    setSnackbar({
      open: true,
      message: "Google Sign Up (demo only)",
      color: "green"
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === validCredentials.email && password === validCredentials.password) {
      setSnackbar({
        open: true,
        message: "Sign up successful!",
        color: "green"
      });
      setTimeout(() => {
        setSnackbar({ open: false, message: "", color: "" });
        navigate("/login");
      }, 1500);
    } else {
      setSnackbar({
        open: true,
        message: "Invalid credentials. Please try again.",
        color: "red"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          color={snackbar.color}
          onClose={() => setSnackbar({ open: false, message: "", color: "" })}
        />
      )}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Sign Up</h2>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded hover:from-green-600 hover:to-green-800 transition mb-4"
        >
          <img src={Google} alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-2 px-4 rounded hover:from-green-600 hover:to-green-800 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="text-green-700 font-semibold hover:underline"
            onClick={() => navigate("/login")}
            type="button"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
