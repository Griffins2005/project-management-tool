import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <h1>Project Manager</h1>
      </div>
      <div>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/progress">Progress</Link>
      </div>
    </nav>
  );
};

export default Navbar;
