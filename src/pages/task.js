import React, { useState, useEffect, useCallback } from "react";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const Task = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    startDate: "",
    dueDate: "",
    projectId: projectId, // Initialize with the passed projectId
  });
  const [addTaskExpanded, setAddTaskExpanded] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editableTask, setEditableTask] = useState({ id: null, field: null });
  const [statusDropdownVisible, setStatusDropdownVisible] = useState({ id: null, visible: false });
  const [assigneeDropdownVisible, setAssigneeDropdownVisible] = useState({ id: null, visible: false });

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/tasks/${projectId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [projectId]); // Add projectId as a dependency

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchPriorities();
      fetchStatuses();
      fetchTeamMembers();
    }
  }, [projectId, fetchTasks]);

  const fetchPriorities = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/priorities");
      setPriorities(response.data);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/statuses");
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/team/members");
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleAddTask = async () => {
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }
    try {
      const taskWithProjectId = { ...newTask, projectId };
      const response = await axios.post(`http://localhost:5001/api/tasks/${projectId}`, taskWithProjectId);
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", assignedTo: "", startDate: "", dueDate: "", projectId });
      setAddTaskExpanded(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = (taskId, field, value) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
    axios
      .put(`http://localhost:5001/api/tasks/${projectId}/${taskId}`, { [field]: value })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    axios
      .put(`http://localhost:5001/api/tasks/${projectId}/${taskId}`, { status: newStatus })
      .catch((error) => console.error("Error updating task status:", error));
    setStatusDropdownVisible({ id: null, visible: false });
  };

  const handleAssigneeChange = (taskId, newAssignee) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, assignedTo: newAssignee } : task
    );
    setTasks(updatedTasks);
    axios
      .put(`http://localhost:5001/api/tasks/${projectId}/${taskId}`, { assignedTo: newAssignee })
      .catch((error) => console.error("Error updating task assignee:", error));
    setAssigneeDropdownVisible({ id: null, visible: false });
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const getPriorityBasedOnDaysRemaining = (daysRemaining) => {
    if (daysRemaining < 0) return "Late";
    if (daysRemaining >= 0 && daysRemaining <= 2) return "Urgent";
    if (daysRemaining >= 3 && daysRemaining <= 5) return "High";
    if (daysRemaining >= 6 && daysRemaining <= 9) return "Medium";
    if (daysRemaining >= 10 && daysRemaining <= 20) return "Low";
    return "Very Low";
  };

  const getPriorityColor = (priorityName) => {
    const priority = priorities.find((p) => p.name === priorityName);
    return priority ? priority.color : "white";
  };

  const getInitials = (name) => {
    if (!name) return "N/A";
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="task-list">
      <div className="task-list-grid">
        {tasks.map((task, index) => {
          const daysRemaining = calculateDaysRemaining(task.dueDate);
          const priorityName = getPriorityBasedOnDaysRemaining(daysRemaining);
          const priorityColor = getPriorityColor(priorityName);

          return (
            <div className="task-card" key={index}>
              <div className="task-header">
                {editableTask.id === task._id && editableTask.field === "title" ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleEditTask(task._id, "title", e.target.value)}
                    onBlur={() => setEditableTask({ id: null, field: null })}
                    autoFocus
                  />
                ) : (
                  <h3
                    className="task-title"
                    onClick={() => setEditableTask({ id: task._id, field: "title" })}
                  >
                    {task.title}
                  </h3>
                )}
                {/* Assignee with Initials and Dropdown */}
                <div className="task-assignee">
                  <div
                    className="assignee-initials"
                    onClick={() =>
                      setAssigneeDropdownVisible({
                        id: task._id,
                        visible: !assigneeDropdownVisible.visible,
                      })
                    }
                  >
                    {getInitials(task.assignedTo)}
                  </div>
                  {assigneeDropdownVisible.id === task._id && assigneeDropdownVisible.visible && (
                    <div className="member-dropdown">
                      <ul>
                        {teamMembers.map((member, index) => (
                          <li
                            key={index}
                            onClick={() => handleAssigneeChange(task._id, member.name)}
                          >
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="task-priority">
                <span className="priority-dot" style={{ backgroundColor: priorityColor }}></span>
                <span className="priority-name">{priorityName}</span>
              </div>

              {/* Task Status */}
              <div className="task-status">
                <div
                  className="status-dropdown"
                  onClick={() =>
                    setStatusDropdownVisible({
                      id: task._id,
                      visible: !statusDropdownVisible.visible,
                    })
                  }
                >
                  {task.status || "Not Started"}
                </div>
                {statusDropdownVisible.id === task._id && statusDropdownVisible.visible && (
                  <div className="status-dropdown-menu">
                    <ul>
                      {statuses.map((status, index) => (
                        <li
                          key={index}
                          onClick={() => handleStatusChange(task._id, status.name)}
                        >
                          {status.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Editable Task Description */}
              {editableTask.id === task._id && editableTask.field === "description" ? (
                <textarea
                  value={task.description}
                  onChange={(e) => handleEditTask(task._id, "description", e.target.value)}
                  onBlur={() => setEditableTask({ id: null, field: null })}
                  autoFocus
                />
              ) : (
                <p
                  className="task-description"
                  onClick={() => setEditableTask({ id: task._id, field: "description" })}
                >
                  {task.description}
                </p>
              )}

              {/* Task Dates */}
              <div className="task-dates">
                <span>
                  Start:{" "}
                  {editableTask.id === task._id && editableTask.field === "startDate" ? (
                    <input
                      type="date"
                      value={task.startDate}
                      onChange={(e) =>
                        handleEditTask(task._id, "startDate", e.target.value)
                      }
                      onBlur={() => setEditableTask({ id: null, field: null })}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditableTask({ id: task._id, field: "startDate" })
                      }
                    >
                      {formatDate(task.startDate)}
                    </span>
                  )}
                </span>
                <span>
                  Due:{" "}
                  {editableTask.id === task._id && editableTask.field === "dueDate" ? (
                    <input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) =>
                        handleEditTask(task._id, "dueDate", e.target.value)
                      }
                      onBlur={() => setEditableTask({ id: null, field: null })}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditableTask({ id: task._id, field: "dueDate" })
                      }
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Card Button */}
        <div className={`task-card add-task-card ${addTaskExpanded ? "expanded" : ""}`}>
          <button
            className="add-task-btn"
            onClick={() => setAddTaskExpanded(!addTaskExpanded)}
          >
            <FaPlusCircle className="icon" /> Add Task
          </button>
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
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">Select Assignee</option>
                  {teamMembers.map((member, index) => (
                    <option key={index} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
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
  );
};

export default Task;