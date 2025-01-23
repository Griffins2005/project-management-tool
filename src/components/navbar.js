import React, { useState } from "react";
import { FaFolder, FaPlusCircle } from "react-icons/fa"; 
import logo from "../assets/logo.png";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const projects = ["Project 1", "Project 2", "Project 3"];

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="project-icon" onClick={toggleDropdown}>
        <FaFolder className="icon" /> Projects
      </div>

      {dropdownVisible && (
        <div className="dropdown">
          <ul className="dropdown-list">
            {projects.map((project, index) => (
              <li key={index} className="dropdown-item">
                {project}
              </li>
            ))}
          </ul>
          <button className="create-project-btn">
            <FaPlusCircle className="icon" /> Create Project
          </button>
        </div>
      )}

      <div className="nav-links">
        <a href="/">Project</a>
        <a href="/priority">Priority</a>
        <a href="/progress">Progress</a>
        <a href="/team">Team</a>
      </div>

      <div className="navbar-logo">
        <a href="/"><img src={logo} alt="Logo" /> </a>
      </div>
    </nav>
  );
};

export default Navbar;
