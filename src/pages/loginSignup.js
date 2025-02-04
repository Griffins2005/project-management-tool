import React from "react";
import { useNavigate } from "react-router-dom"; 
import google from "../assets/google.png"
import logo from "../assets/logo.png"

const Login = () => {
  const navigate = useNavigate();

  const handleSuccessLogin = () => {
    navigate("/project");
  };

  const handleGoogleLogin = () => {
    window.open("https://project-management-backend-vrup.onrender.com/api/auth/google", "_self");
    handleSuccessLogin();
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Welcome to Project Management Tool</h1>
        <img src={logo} alt="logo" className="login-image" />
        <p className="login-description">Sign in with Google to continue</p>
        <button onClick={handleGoogleLogin} className="google-login-btn">
          <img src={google} alt="Google Logo" className="google-logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
