import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracking = () => {
  const [statuses, setStatuses] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
  const [newStatus, setNewStatus] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_URL = `https://project-management-backend-tool.vercel.app`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statusesResponse, tasksResponse] = await Promise.all([
          fetch(`https://project-management-backend-tool.vercel.app/statuses`),
          fetch(`https://project-management-backend-tool.vercel.app/tasks`),
        ]);

        if (!statusesResponse.ok || !tasksResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const statusesData = await statusesResponse.json();
        const tasksData = await tasksResponse.json();

        const counts = tasksData.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});

        setStatuses(statusesData);
        setTaskCounts(counts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      setStatuses((prevStatuses) =>
        editStatus
          ? prevStatuses.map((status) =>
              status._id === data._id ? data : status
            )
          : [...prevStatuses, data]
      );

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
    setNewStatus({ name: status.name });
    setEditStatus(status);
    setFormVisible(true);
  };

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
      legend: { position: "top" },
      title: { display: true, text: "Task Distribution by Status" },
    },
  };

  return (
    <div className="progress-tracking">
      <h1>Progress Tracking</h1>

      {loading && <div className="loading">Loading...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="status-table">
        <button onClick={() => setFormVisible(true)}>Add New Status</button>

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

        {statuses.length === 0 ? (
          <p>No statuses available.</p>
        ) : (
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
                    <button className="edit-btn" onClick={() => handleEdit(status)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => deleteStatus(status._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="chart">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProgressTracking;