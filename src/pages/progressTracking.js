import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProgressTracking = () => {
  const [statuses, setStatuses] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
  const [newStatus, setNewStatus] = useState({
    name: "",
  });

  const API_URL = "http://localhost:5001/api";

  // Fetch statuses and task counts from the backend
  const fetchData = async () => {
    try {
      const [statusesResponse, taskCountsResponse] = await Promise.all([
        fetch(`${API_URL}/statuses`),
        fetch(`${API_URL}/tasks`),
      ]);

      if (!statusesResponse.ok || !taskCountsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const statusesData = await statusesResponse.json();
      const taskCountsData = await taskCountsResponse.json();

      setStatuses(statusesData);
      setTaskCounts(taskCountsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Add or update a status
  const saveStatus = async () => {
    try {
      const url = editStatus
        ? `${API_URL}/statuses/${editStatus._id}`
        : `${API_URL}/statuses`;
      const method = editStatus ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (editStatus) {
        setStatuses((prevStatuses) =>
          prevStatuses.map((status) => (status._id === data._id ? data : status))
        );
      } else {
        setStatuses((prevStatuses) => [...prevStatuses, data]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving status:", error);
    }
  };

  // Delete a status
  const deleteStatus = async (id) => {
    try {
      await fetch(`${API_URL}/statuses/${id}`, { method: "DELETE" });
      setStatuses((prevStatuses) =>
        prevStatuses.filter((status) => status._id !== id)
      );
    } catch (error) {
      console.error("Error deleting status:", error);
    }
  };

  // Reset the form
  const resetForm = () => {
    setNewStatus({ name: "" });
    setEditStatus(null);
    setFormVisible(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit button click
  const handleEdit = (status) => {
    setNewStatus({
      name: status.name,
    });
    setEditStatus(status);
    setFormVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="progress-tracking">
      <h1>Progress Tracking</h1>

      {/* Combined Table */}
      <div className="status-table">
        <button onClick={() => setFormVisible(true)}>Add New Status</button>

        {/* Add/Edit Status Form */}
        {formVisible && (
          <div className="status-form">
            <h2>{editStatus ? "Edit Status" : "Add Status"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveStatus();
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Status Name"
                value={newStatus.name}
                onChange={handleInputChange}
                required
              />
              <button type="submit">{editStatus ? "Update" : "Add"}</button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Status Table */}
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Task Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status._id}>
                <td>{status.name}</td>
                <td>{taskCounts[status.name] || 0}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(status)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteStatus(status._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTracking;