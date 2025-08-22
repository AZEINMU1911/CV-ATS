import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-900/30 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            className="text-2xl font-bold text-yellow-300 hover:text-yellow-400 transition"
          >
            CVATS
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">
                  Welcome, {user?.firstName || user?.email}
                </span>
                <Link
                  to="/home"
                  className="font-semibold hover:text-yellow-300 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow-md hover:bg-yellow-500 hover:scale-105 transition transform"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-semibold hover:text-yellow-300 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="font-semibold hover:text-yellow-300 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-4">
                <span className="text-gray-300 pt-2">
                  Welcome, {user?.firstName || user?.email}
                </span>
                <Link
                  to="/home"
                  className="block font-semibold hover:text-yellow-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow-md hover:bg-yellow-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Link
                  to="/login"
                  className="block font-semibold hover:text-yellow-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block font-semibold hover:text-yellow-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
