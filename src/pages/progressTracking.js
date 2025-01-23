import React from 'react';

const ProgressTracking = ({ tasks }) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <h1>Progress Tracking</h1>
      <div>
        <h2>Overall Progress</h2>
        <div style={{ border: '1px solid #ddd', width: '100%', height: '30px', borderRadius: '5px' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              borderRadius: '5px',
              transition: 'width 0.3s ease-in-out',
            }}
          ></div>
        </div>
        <p>{completedTasks} of {totalTasks} tasks completed</p>
      </div>
    </div>
  );
};

export default ProgressTracking;