import React, { useState } from "react";
import { FaFolder, FaPlusCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import { v4 as uuidv4 } from "uuid";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCreateProjectClick = () => {
    setIsFormVisible(true); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newProjectName.trim() === "") return;

    const newProject = {
      id: uuidv4(),
      name: newProjectName.trim(),
    };
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id); 
    setNewProjectName(""); 
    setIsFormVisible(false);
  };

  const handleSelectProject = (projectId) => {
    setActiveProjectId(projectId);
  };

  return (
    <nav className="navbar">
      <div className="project-icon" onClick={toggleDropdown}>
        <FaFolder className="icon" /> Projects
      </div>

      {dropdownVisible && (
        <div className="dropdown">
          <ul className="dropdown-list">
            {projects.map((project) => (
              <li
                key={project.id}
                className={`dropdown-item ${
                  activeProjectId === project.id ? "active" : ""
                }`}
                onClick={() => handleSelectProject(project.id)}
              >
                {project.name}
              </li>
            ))}
          </ul>
          <button className="create-project-btn" onClick={handleCreateProjectClick}>
            <FaPlusCircle className="icon" /> Create Project
          </button>
        </div>
      )}

      {/* Project Creation Form */}
      {isFormVisible && (
        <div className="project-form-modal">
          <form className="project-form" onSubmit={handleFormSubmit}>
            <h3>Create New Project</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
              required
              className="project-name-input"
            />
            <button type="submit" className="submit-btn">
              Save
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="nav-links">
        <a href="/">Project</a>
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