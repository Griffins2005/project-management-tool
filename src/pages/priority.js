import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import { FaPlus, FaEdit, FaSave, FaTrash } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, PieController);

const Priority = () => {
  const [priorities, setPriorities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newPriority, setNewPriority] = useState({
    name: "",
    color: "#000000",
  });

  const chartRef = useRef(null);

  const API_URL = "http://localhost:5001/api";

  const fetchPriorities = async () => {
    try {
      const response = await fetch(`${API_URL}/priorities`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPriorities(data);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched tasks:", data); 
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addOrUpdatePriority = async () => {
    try {
      const { name, color } = newPriority;

      if (!name || !color) {
        alert("Please fill in all fields.");
        return;
      }

      const url =
        editIndex !== null
          ? `${API_URL}/priorities/${priorities[editIndex]._id}`
          : `${API_URL}/priorities`;
      const method = editIndex !== null ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (editIndex !== null) {
        const updatedPriorities = [...priorities];
        updatedPriorities[editIndex] = data;
        setPriorities(updatedPriorities);
      } else {
        setPriorities((prev) => [...prev, data]);
      }

      setNewPriority({ name: "", color: "#000000" });
      setEditIndex(null);
      setFormVisible(false);
    } catch (error) {
      console.error("Error saving priority:", error);
    }
  };

  const deletePriority = async (id) => {
    try {
      await fetch(`${API_URL}/priorities/${id}`, { method: "DELETE" });
      setPriorities((prev) => prev.filter((priority) => priority._id !== id));
    } catch (error) {
      console.error("Error deleting priority:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching data..."); 
    fetchPriorities();
    fetchTasks();
  }, []);

  const calculateTaskCounts = () => {
    const counts = priorities.map((priority) => {
      const count = tasks.filter((task) => task.priority === priority.name).length;
      return { ...priority, count };
    });
    console.log("Priorities with counts:", counts);
    return counts;
  };

  const prioritiesWithCounts = calculateTaskCounts();

  const pieData = {
    labels: prioritiesWithCounts.map((p) => p.name),
    datasets: [
      {
        data: prioritiesWithCounts.map((p) => p.count),
        backgroundColor: prioritiesWithCounts.map((p) => p.color),
      },
    ],
  };

  console.log("Pie chart data:", pieData);

  return (
    <div className="priority-page">
      <h1>Priorities</h1>
      <button className="add-priority-btn" onClick={() => setFormVisible(true)}>
        <FaPlus className="icon" /> Add Priority
      </button>

      {/* Priority Form */}
      {formVisible && (
        <div className="priority-form">
          <h3>{editIndex !== null ? "Edit Priority" : "Add Priority"}</h3>
          <input
            type="text"
            name="name"
            placeholder="Priority Name"
            value={newPriority.name}
            onChange={(e) =>
              setNewPriority((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="color"
            name="color"
            value={newPriority.color}
            onChange={(e) =>
              setNewPriority((prev) => ({ ...prev, color: e.target.value }))
            }
          />
          <button className="save-btn" onClick={addOrUpdatePriority}>
            <FaSave className="icon" /> Save
          </button>
          <button className="cancel-btn" onClick={() => setFormVisible(false)}>
            Cancel
          </button>
        </div>
      )}

      {/* Table of Priorities */}
      <table className="priority-table">
        <thead>
          <tr>
            <th>Priority Name</th>
            <th>Task Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {prioritiesWithCounts.map((priority, index) => (
            <tr key={index}>
              <td>{priority.name}</td>
              <td>{priority.count}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditIndex(index);
                    setNewPriority({
                      name: priority.name,
                      color: priority.color,
                    });
                    setFormVisible(true);
                  }}
                >
                  <FaEdit className="icon" />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deletePriority(priority._id)}
                >
                  <FaTrash className="icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pie Chart */}
      <div className="pie-chart">
        <h3>Priority Distribution</h3>
        <Pie data={pieData} ref={chartRef} />
      </div>
    </div>
  );
};

export default Priority;