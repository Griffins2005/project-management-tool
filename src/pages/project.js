import React, { useState, useEffect } from "react";
import { FaFilter, FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const Project = () => {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sideDropdown, setSideDropdown] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", startDate: "", dueDate: "" });
  const [addTaskExpanded, setAddTaskExpanded] = useState(false); // State for expanding the add task card

  const projectName = "Project 1";

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
    setSideDropdown(""); // Reset side dropdown
  };

  const toggleSideDropdown = (type) => {
    setSideDropdown(sideDropdown === type ? "" : type);
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post("http://localhost:5001/tasks", newTask);
      setTasks([...tasks, response.data]); // Update tasks with the newly added task
      setNewTask({ title: "", description: "", assignedTo: "", startDate: "", dueDate: "" }); // Reset form
      setAddTaskExpanded(false); // Close the add task form after submission
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

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
              {tasks.map((task, index) => (
                <li key={index}>{task.assignedTo || "Unassigned"}</li>
              ))}
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
          <div className={`task-card add-task-card ${addTaskExpanded ? "expanded" : ""}`}>
            <button
              className="add-task-btn"
              onClick={() => setAddTaskExpanded(!addTaskExpanded)} // Toggle expand form
            >
              <FaPlusCircle className="icon" /> Add Task
            </button>

            {/* Add Task Form inside the card */}
            {addTaskExpanded && (
              <div className="add-task-form">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Assigned To"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    placeholder="Due Date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <button type="submit">Add Task</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;