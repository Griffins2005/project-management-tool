import React, { useState } from 'react';

const TaskManagement = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Handlers
  const handleAddTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), projectId }]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleSelectTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setSelectedTask(task);
  };

  return (
    <div>
      <h1>Task Management</h1>

      {/* Task List */}
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks
            .filter((task) => task.projectId === projectId)
            .map((task) => (
              <li key={task.id} onClick={() => handleSelectTask(task.id)}>
                {task.name}
              </li>
            ))}
        </ul>
      </div>

      {/* Task Details */}
      {selectedTask && (
        <div>
          <h2>Task Details</h2>
          <p>Name: {selectedTask.name}</p>
          <p>Description: {selectedTask.description}</p>
          <p>Deadline: {selectedTask.deadline}</p>
        </div>
      )}

      {/* Add Task */}
      <div>
        <h2>Add Task</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newTask = {
              name: e.target.name.value,
              description: e.target.description.value,
              deadline: e.target.deadline.value,
            };
            handleAddTask(newTask);
          }}
        >
          <input name="name" placeholder="Task Name" required />
          <input name="description" placeholder="Task Description" required />
          <input name="deadline" type="date" required />
          <button type="submit">Add Task</button>
        </form>
      </div>

      {/* Update Task */}
      {selectedTask && (
        <div>
          <h2>Update Task</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedTask = {
                ...selectedTask,
                name: e.target.name.value,
                description: e.target.description.value,
                deadline: e.target.deadline.value,
              };
              handleUpdateTask(updatedTask);
              setSelectedTask(null);
            }}
          >
            <input name="name" defaultValue={selectedTask.name} required />
            <input name="description" defaultValue={selectedTask.description} required />
            <input name="deadline" defaultValue={selectedTask.deadline} type="date" required />
            <button type="submit">Update Task</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
