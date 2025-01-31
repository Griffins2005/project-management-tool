import React from "react";
//import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  //const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h1>Project Management</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/priority">Priority</a>
        <a href="/progress">Progress</a>
        <a href="/team">Team</a>
      </div>
      <div className="navbar-logo">
        <a href="/">
          <img src={logo} alt="Logo" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;