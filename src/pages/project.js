import React, { useState } from "react";
import { FaFilter, FaPlusCircle } from "react-icons/fa";

const Project = () => {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sideDropdown, setSideDropdown] = useState("");

  const projectName = "Project 1";

  const toggleFilterDropdown = () => {
    if (filterDropdownVisible) {
      // If dropdown is visible, close it and reset the side dropdown
      setFilterDropdownVisible(false);
      setSideDropdown("");
    } else {
      // Open the dropdown
      setFilterDropdownVisible(true);
    }
  };

  const toggleSideDropdown = (type) => {
    // Toggle the specific side dropdown
    setSideDropdown(sideDropdown === type ? "" : type);
  };

  const assignments = []; // Replace with an array of assigned names if available

  const tasks = [
    {
      title: "Task 1",
      assignedTo: "JK", // Initials of the assigned user
      description: "This is the first task for the project.",
      startDate: "2025-01-01",
      dueDate: "2025-01-10",
    },
    {
      title: "Task 2",
      assignedTo: "AM",
      description: "This task needs attention on priority.",
      startDate: "2025-01-05",
      dueDate: "2025-01-15",
    },
    {
      title: "Task 3",
      assignedTo: "RB",
      description: "Finalize and submit the documentation.",
      startDate: "2025-01-08",
      dueDate: "2025-01-20",
    },
  ];

  return (
    <div className="project-page">
      <nav className="project-navbar">
        <h1 className="project-title">Welcome to {projectName}</h1>
        <div className="navbar-buttons">
          {/* Filters Button */}
          <div className="filters">
            <button className="filter-btn" onClick={toggleFilterDropdown}>
              <FaFilter className="icon" /> Filters
            </button>

            {/* Filter Dropdown */}
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

          {/* Add Task Button */}
          <button className="add-task-btn">
            <FaPlusCircle className="icon" /> Add Task
          </button>
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
              <li>High</li>
              <li>Medium</li>
              <li>Low</li>
            </ul>
          </div>
        )}
        {sideDropdown === "progress" && (
          <div className="side-dropdown">
            <h3>Progress</h3>
            <ul>
              <li>Not Started</li>
              <li>In Progress</li>
              <li>Completed</li>
            </ul>
          </div>
        )}
        {sideDropdown === "assignment" && (
          <div className="side-dropdown">
            <h3>Assignment</h3>
            <ul>
              {assignments.length > 0 ? (
                assignments.map((name, index) => <li key={index}>{name}</li>)
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="task-list">
        <div className="task-list-grid">
          {tasks.map((task, index) => (
            <div className="task-card" key={index}>
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="user-icon">{task.assignedTo}</div>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-dates">
                <span>Start: {task.startDate}</span>
                <span>Due: {task.dueDate}</span>
              </div>
            </div>
          ))}

          {/* Add Card Button */}
          <div className="task-card add-task-card">
            <button className="add-task-btn">
              <FaPlusCircle className="icon" /> Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;