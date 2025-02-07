import React, { useState, useEffect } from "react";
import { FaFilter, FaPlus, FaProjectDiagram, FaTrash, FaCheck } from "react-icons/fa";
import Task from "./task";
import axios from "axios";

const Project = () => {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sideDropdown, setSideDropdown] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [selectedDueDateFilter, setSelectedDueDateFilter] = useState(null);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState(null);
  const [selectedProgressFilter, setSelectedProgressFilter] = useState(null);
  const [selectedAssignmentFilter, setSelectedAssignmentFilter] = useState(null);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get("https://project-management-backend-tool.onrender.com/api/statuses");
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("https://project-management-backend-tool.onrender.com/api/team/members");
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await axios.get("https://project-management-backend-tool.onrender.com/api/priorities");
      setPriorities(response.data);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("https://project-management-backend-tool.onrender.com/api/projects");
      console.log("Projects fetched:", response.data);
      setProjects(response.data);

      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0].id);
        setProjectName(response.data[0].name);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const response = await axios.post("https://project-management-backend-tool.onrender.com/api/projects", { name: newProjectName });
      setProjects([...projects, response.data]);
      setNewProjectName("");
      setShowCreateProjectForm(false);

      if (!selectedProjectId) {
        setSelectedProjectId(response.data.id);
        setProjectName(response.data.name);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const updateProject = async (id, newName) => {
    try {
      await axios.put(`https://project-management-backend-tool.onrender.com/api/projects/${id}`, { name: newName });
      const updatedProjects = projects.map((project) =>
        project.id === id ? { ...project, name: newName } : project
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the project and its contents? This action is irreversible."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://project-management-backend-tool.onrender.com/api/projects/${id}`);
      await axios.delete(`https://project-management-backend-tool.onrender.com/api/tasks?projectId=${id}`);
      setProjects(projects.filter((project) => project.id !== id));

      if (selectedProjectId === id && projects.length > 0) {
        setSelectedProjectId(projects[0].id);
        setProjectName(projects[0].name);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleProjectClick = (projectId, projectName) => {
    setSelectedProjectId(projectId);
    setProjectName(projectName);
  };

  useEffect(() => {
    fetchStatuses();
    fetchTeamMembers();
    fetchPriorities();
    fetchProjects();
  }, []);

  const toggleFilterDropdown = () => {
    if (filterDropdownVisible) {
      setSelectedDueDateFilter(null);
      setSelectedPriorityFilter(null);
      setSelectedProgressFilter(null);
      setSelectedAssignmentFilter(null);
      setFilterDropdownVisible(false);
    } else {
      setFilterDropdownVisible(true);
    }
    setSideDropdown("");
  };

  const toggleSideDropdown = (type) => {
    setSideDropdown(sideDropdown === type ? "" : type);
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleProjectNameBlur = async () => {
    setIsEditing(false);
    if (selectedProjectId) {
      await updateProject(selectedProjectId, projectName);
    }
  };

  const handleDueDateFilter = (filter) => {
    setSelectedDueDateFilter(filter);
    setSideDropdown("");
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriorityFilter(priority);
    setSideDropdown("");
  };

  const handleProgressFilter = (status) => {
    setSelectedProgressFilter(status);
    setSideDropdown("");
  };

  const handleAssignmentFilter = (member) => {
    setSelectedAssignmentFilter(member);
    setSideDropdown("");
  };

  return (
    <div className="project-page">
      <div className="sidebar">
        <h2>
          <FaProjectDiagram /> Projects
        </h2>
        <button onClick={() => setShowCreateProjectForm(!showCreateProjectForm)}>
          <FaPlus /> Create Project
        </button>
        {showCreateProjectForm && (
          <div>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
            />
            <button onClick={createProject}>Save</button>
          </div>
        )}
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className={`project-item ${selectedProjectId === project.id ? "selected" : ""}`}
                onClick={() => handleProjectClick(project.id, project.name)}
              >
                {selectedProjectId === project.id && <FaCheck className="tick-icon" />}
                {project.name}
                <FaTrash
                  className="delete-icon"
                  onClick={() => deleteProject(project.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>Please create a project before adding tasks!</p>
        )}
      </div>

      <div className="main-content">
        <nav className="project-navbar">
          {isEditing ? (
            <input
              type="text"
              value={projectName}
              onChange={handleProjectNameChange}
              onBlur={handleProjectNameBlur}
              autoFocus
            />
          ) : (
            <h1 className="project-title" onClick={() => setIsEditing(true)}>
              Welcome to {projectName}
            </h1>
          )}
          <div className="navbar-buttons">
            <div className="filters">
              <button className="filter-btn" onClick={toggleFilterDropdown}>
                <FaFilter className="icon" /> {filterDropdownVisible ? "Clear Filters" : "Filters"}
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

        <div className="side-dropdowns">
          {sideDropdown === "dueDate" && (
            <div className="side-dropdown">
              <h3>Due Date</h3>
              <ul>
                <li onClick={() => handleDueDateFilter("Late")}>Late</li>
                <li onClick={() => handleDueDateFilter("Today")}>Today</li>
                <li onClick={() => handleDueDateFilter("Tomorrow")}>Tomorrow</li>
                <li onClick={() => handleDueDateFilter("This Week")}>This Week</li>
                <li onClick={() => handleDueDateFilter("Next Week")}>Next Week</li>
                <li onClick={() => handleDueDateFilter("Future")}>Future</li>
              </ul>
            </div>
          )}
          {sideDropdown === "priority" && (
            <div className="side-dropdown">
              <h3>Priority</h3>
              <ul>
                {priorities.map((priority, index) => (
                  <li key={index} onClick={() => handlePriorityFilter(priority.name)}>
                    <span
                      className="priority-dot"
                      style={{ backgroundColor: priority.color }}
                    ></span>
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
                  <li key={index} onClick={() => handleProgressFilter(status.name)}>
                    {status.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sideDropdown === "assignment" && (
            <div className="side-dropdown">
              <h3>Assignment</h3>
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index} onClick={() => handleAssignmentFilter(member.name)}>
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {selectedProjectId && (
          <Task
            projectId={selectedProjectId}
            projectName={projectName}
            dueDateFilter={selectedDueDateFilter}
            priorityFilter={selectedPriorityFilter}
            progressFilter={selectedProgressFilter}
            assignmentFilter={selectedAssignmentFilter}
          />
        )}
      </div>
    </div>
  );
};

export default Project;
