import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracking = () => {
  const [statuses, setStatuses] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
  const [newStatus, setNewStatus] = useState({
    name: "",
  });

  const API_URL = "https://project-management-backend-app.onrender.com";

  const fetchData = async () => {
    try {
      const [statusesResponse, tasksResponse] = await Promise.all([
        fetch(`${API_URL}/statuses`),
        fetch(`${API_URL}/tasks`),
      ]);

      if (!statusesResponse.ok || !tasksResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const statusesData = await statusesResponse.json();
      const tasksData = await tasksResponse.json();

      const counts = {};
      tasksData.forEach((task) => {
        if (counts[task.status]) {
          counts[task.status]++;
        } else {
          counts[task.status] = 1;
        }
      });

      setStatuses(statusesData);
      setTaskCounts(counts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  const resetForm = () => {
    setNewStatus({ name: "" });
    setEditStatus(null);
    setFormVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const chartData = {
    labels: statuses.map((status) => status.name),
    datasets: [
      {
        label: "Task Count",
        data: statuses.map((status) => taskCounts[status.name] || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Task Distribution by Status",
      },
    },
  };

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

      {/* Pie Chart */}
      <div className="chart-container" style={{ width: "400px", margin: "20px auto" }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProgressTracking;
