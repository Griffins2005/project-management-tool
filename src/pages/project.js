import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import Task from "./task";

const Project = ({ children }) => {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sideDropdown, setSideDropdown] = useState("");
  const projectName = "Project 1";

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
    setSideDropdown("");
  };

  const toggleSideDropdown = (type) => {
    setSideDropdown(sideDropdown === type ? "" : type);
  };

  return (
    <div className="project-page">
      <nav className="project-navbar">
        <h1 className="project-title">Welcome to {projectName}</h1>
        <div className="navbar-buttons">
          <div className="filters">
            <button className="filter-btn" onClick={toggleFilterDropdown}>
              <FaFilter className="icon" /> Filters
            </button>
            {filterDropdownVisible && (
              <div className="filter-dropdown">
                <ul>
                  <li onClick={() => toggleSideDropdown("dueDate")}>Due Date</li>
                  <li onClick={() => toggleSideDropdown("priority")}>Priority</li>
                  <li onClick={() => toggleSideDropdown("progress")}>Progress</li>
                  <li onClick={() => toggleSideDropdown("assignment")}>Assignment</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Side Dropdowns */}
      <div className="side-dropdowns">
        {sideDropdown === "dueDate" && (
          <div className="side-dropdown">
            <h3>Due Date</h3>
            <ul>
              <li>Late</li>
              <li>Today</li>
              <li>Tomorrow</li>
              <li>This Week</li>
              <li>Next Week</li>
              <li>Future</li>
            </ul>
          </div>
        )}
        {sideDropdown === "priority" && (
          <div className="side-dropdown">
            <h3>Priority</h3>
            <ul>
              {priorities.map((priority, index) => (
                <li key={index}>
                  <span className="priority-dot" style={{ backgroundColor: priority.color }}></span>
                  {priority.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {sideDropdown === "progress" && (
          <div className="side-dropdown">
            <h3>Progress</h3>
            <ul>
              {statuses.map((status, index) => (
                <li key={index}>{status.name}</li>
              ))}
            </ul>
          </div>
        )}
        {sideDropdown === "assignment" && (
          <div className="side-dropdown">
            <h3>Assignment</h3>
            <ul>
              {teamMembers.map((member, index) => (
                <li key={index}>{member.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Task />
    </div>
  );
};

export default Project;