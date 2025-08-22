// src/pages/RegisterPage.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import GoogleLoginButton from "../components/GoogleLoginButton";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- THE FIX: Select each piece of state individually ---
  // This is the stable way to select from the store and avoids infinite loops.
  const register = useAuthStore((state) => state.register);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const success = await register(firstName, lastName, email, password);
    if (success) {
      navigate("/login");
    }
  };

  return (
    // The JSX for your component is perfect and does not need to be changed.
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-black p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-gray-300">Join CVATS today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700/50 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700/50 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <input
            placeholder="Email Address"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-white bg-gray-700/50 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            placeholder="Password (min. 6 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-white bg-gray-700/50 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {error && (
            <p className="text-red-400 text-sm text-center pt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-2xl shadow-lg hover:bg-yellow-500 hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400 rounded-full">
              Or
            </span>
          </div>
        </div>

        <div>
          <GoogleLoginButton />
        </div>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-yellow-300 hover:text-yellow-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
