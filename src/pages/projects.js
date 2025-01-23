import React, { useState } from 'react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Handlers
  const handleCreateProject = (project) => {
    setProjects([...projects, project]);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const handleSelectProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);
  };

  return (
    <div>
      <h1>Project Management</h1>

      {/* Project List */}
      <div>
        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} onClick={() => handleSelectProject(project.id)}>
              {project.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Project Details */}
      {selectedProject && (
        <div>
          <h2>Project Details</h2>
          <p>Name: {selectedProject.name}</p>
          <p>Description: {selectedProject.description}</p>
          <p>Deadline: {selectedProject.deadline}</p>
        </div>
      )}

      {/* Create Project */}
      <div>
        <h2>Create Project</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newProject = {
              id: Date.now(),
              name: e.target.name.value,
              description: e.target.description.value,
              deadline: e.target.deadline.value,
            };
            handleCreateProject(newProject);
          }}
        >
          <input name="name" placeholder="Project Name" required />
          <input name="description" placeholder="Project Description" required />
          <input name="deadline" type="date" required />
          <button type="submit">Create</button>
        </form>
      </div>

      {/* Update Project */}
      {selectedProject && (
        <div>
          <h2>Update Project</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedProject = {
                ...selectedProject,
                name: e.target.name.value,
                description: e.target.description.value,
                deadline: e.target.deadline.value,
              };
              handleUpdateProject(updatedProject);
              setSelectedProject(null);
            }}
          >
            <input name="name" defaultValue={selectedProject.name} required />
            <input name="description" defaultValue={selectedProject.description} required />
            <input name="deadline" defaultValue={selectedProject.deadline} type="date" required />
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;