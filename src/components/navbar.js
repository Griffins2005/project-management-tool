import React from "react";
import logo from "../assets/logo.png";

const Navbar = () => {

  return (
    <nav className="navbar">
      <h1>Project Management</h1>
      <div className="nav-links">
        <a href="/project">Home</a>
        <a href="/priority">Priority</a>
        <a href="/progress">Progress</a>
        <a href="/team">Team</a>
      </div>
      <div className="navbar-logo">
        <a href="/project">
          <img src={logo} alt="Logo" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;