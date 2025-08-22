import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router"; // Using your preferred 'react-router'
import useAuthStore from "../store/authStore.js";
import {api} from "../lib/api";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  // This hook selector now works reliably with our new store structure.
  const { setAuth, setError } = useAuthStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const backendResponse = await api.post("/google-login", {
        token: idToken,
      });

      const { access_token, user } = backendResponse.data;

      // This now calls the action correctly
      setAuth({ token: access_token, user });

      navigate("/home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Google login failed on our server.";
      console.error("Google login failed:", errorMessage);
      setError(errorMessage);
    }
  };

  const handleGoogleError = () => {
    const errorMessage = "Google Sign-In was closed or failed.";
    console.error(errorMessage);
    setError(errorMessage);
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      theme="filled_black"
      shape="pill"
    />
  );
};

export default GoogleLoginButton;
