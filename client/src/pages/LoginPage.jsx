// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore.js";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const success = await login(email, password);
    if (success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-300">Sign in to continue to CVATS</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-yellow-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700/50 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-yellow-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700/50 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-2xl shadow-lg hover:bg-yellow-500 hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400 rounded-full">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
