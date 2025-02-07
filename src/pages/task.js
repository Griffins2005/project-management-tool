import React, { useState, useEffect, useCallback } from "react";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const Task = ({
  projectId,
  projectName,
  dueDateFilter,
  priorityFilter,
  progressFilter,
  assignmentFilter,
}) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    startDate: "",
    dueDate: "",
    projectId: projectId,
  });
  const [addTaskExpanded, setAddTaskExpanded] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editableTask, setEditableTask] = useState({ id: null, field: null });
  const [statusDropdownVisible, setStatusDropdownVisible] = useState({ id: null, visible: false });
  const [assigneeDropdownVisible, setAssigneeDropdownVisible] = useState({ id: null, visible: false });
  const [errorMessage, setErrorMessage] = useState("");

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const getPriorityBasedOnDaysRemaining = (task) => {
    const daysRemaining = calculateDaysRemaining(task.dueDate);
    if (daysRemaining === null) return "No Due Date";
    if (daysRemaining < 0) return "Late";
    if (daysRemaining >= 0 && daysRemaining <= 2) return "Urgent";
    if (daysRemaining >= 3 && daysRemaining <= 5) return "High";
    if (daysRemaining >= 6 && daysRemaining <= 9) return "Medium";
    if (daysRemaining >= 10 && daysRemaining <= 20) return "Low";
    return "Very Low";
  };

  const isTaskDueDateMatch = (task, filter) => {
    const daysRemaining = calculateDaysRemaining(task.dueDate);
    switch (filter) {
      case "Late":
        return daysRemaining < 0;
      case "Today":
        return daysRemaining === 0;
      case "Tomorrow":
        return daysRemaining === 1;
      case "This Week":
        return daysRemaining >= 0 && daysRemaining <= 7;
      case "Next Week":
        return daysRemaining > 7 && daysRemaining <= 14;
      case "Future":
        return daysRemaining > 14;
      default:
        return true;
    }
  };

  const isTaskPriorityMatch = (task, filter) => {
    const priorityName = getPriorityBasedOnDaysRemaining(task);
    return priorityName === filter;
  };

  const isTaskProgressMatch = (task, filter) => {
    return task.status === filter;
  };

  const isTaskAssignmentMatch = (task, filter) => {
    return task.assignedTo === filter;
  };

  const filteredTasks = tasks.filter((task) => {
    if (dueDateFilter && !isTaskDueDateMatch(task, dueDateFilter)) return false;
    if (priorityFilter && !isTaskPriorityMatch(task, priorityFilter)) return false;
    if (progressFilter && !isTaskProgressMatch(task, progressFilter)) return false;
    if (assignmentFilter && !isTaskAssignmentMatch(task, assignmentFilter)) return false;
    return true;
  });

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }
    try {
      const response = await axios.get(`https://project-management-backend-tool.vercel.app/api/tasks/${projectId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [projectId]);

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
      const response = await axios.get(`https://project-management-backend-tool.vercel.app/api/priorities`);
      setPriorities(response.data);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`https://project-management-backend-tool.vercel.app/api/statuses`);
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`https://project-management-backend-tool.vercel.app/api/team/members`);
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

    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.startDate || !newTask.dueDate) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const priorityName = getPriorityBasedOnDaysRemaining(newTask);
      const priority = priorities.find((p) => p.name === priorityName);

      const taskWithProjectIdAndPriority = {
        ...newTask,
        projectId,
        priority: priority ? priority._id : null, 
      };

      const response = await axios.post(`https://project-management-backend-tool.vercel.app/api/tasks/${projectId}`, taskWithProjectIdAndPriority);
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", assignedTo: "", startDate: "", dueDate: "", projectId });
      setAddTaskExpanded(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = (taskId, field, value) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, [field]: value } : task
    );

    if (field === "dueDate") {
      const taskToUpdate = updatedTasks.find((task) => task._id === taskId);
      const priorityName = getPriorityBasedOnDaysRemaining(taskToUpdate);
      const priority = priorities.find((p) => p.name === priorityName);

      taskToUpdate.priority = priority ? priority._id : null;
    }

    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find((task) => task._id === taskId);
    axios
      .put(`https://project-management-backend-tool.vercel.app/api/tasks/${projectId}/${taskId}`, taskToUpdate)
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    axios
      .put(`https://project-management-backend-tool.vercel.app/api/tasks/${projectId}/${taskId}`, { status: newStatus })
      .catch((error) => console.error("Error updating task status:", error));
    setStatusDropdownVisible({ id: null, visible: false });
  };

  const handleAssigneeChange = (taskId, newAssignee) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, assignedTo: newAssignee } : task
    );
    setTasks(updatedTasks);
    axios
      .put(`https://project-management-backend-tool.vercel.app/api/tasks/${projectId}/${taskId}`, { assignedTo: newAssignee })
      .catch((error) => console.error("Error updating task assignee:", error));
    setAssigneeDropdownVisible({ id: null, visible: false });
  };

  const getPriorityColor = (priorityName) => {
    const priority = priorities.find((p) => p.name === priorityName);
    return priority ? priority.color : "#CCCCCC";
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
        {filteredTasks.map((task, index) => {
          const priorityName = getPriorityBasedOnDaysRemaining(task);
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

              <div className="task-priority">
                <span className="priority-dot" style={{ backgroundColor: priorityColor }}></span>
                <span className="priority-name">{priorityName}</span>
              </div>

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
                  {task.status}
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

        <div className={`task-card add-task-card ${addTaskExpanded ? "expanded" : ""}`}>
          <button
            className="add-task-btn"
            onClick={() => setAddTaskExpanded(!addTaskExpanded)}
          >
            <FaPlusCircle className="icon" /> Add Task
          </button>
          {addTaskExpanded && (
            <div className="add-task-form">
              {errorMessage && <div className="error-message">{errorMessage}</div>}
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
                  required
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
                  required
                />
                <input
                  type="date"
                  placeholder="Due Date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
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
