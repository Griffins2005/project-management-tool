import React, { useState, useEffect } from "react";
import { FaUserPlus, FaSave, FaEnvelope, FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    skills: "",
    email: "",
    experience: "",
    position: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("https://project-management-backend-tool.onrender.com/api/team/members");
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setMessage("Failed to fetch team members.");
    }
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
    setEditMemberId(null); 
    setNewMember({ name: "", skills: "", email: "", experience: "", position: "" }); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const saveMember = async () => {
    const { name, skills, email, experience, position } = newMember;
  
    if (name && skills && email && experience && position) {
      try {
        const url = editMemberId
          ? `https://project-management-backend-tool.onrender.com/api/team/members/${editMemberId}` 
          : "https://project-management-backend-tool.onrender.com/api/team/members"; 
  
        const method = editMemberId ? "PUT" : "POST";
  
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember),
        });
  
        if (response.ok) {
          setMessage(
            editMemberId ? "Member updated successfully!" : "Member added successfully!"
          );
          setNewMember({ name: "", skills: "", email: "", experience: "", position: "" });
          setFormVisible(false);
          setEditMemberId(null);
          fetchTeamMembers(); 
        } else {
          const errorData = await response.json();
          setMessage(`Failed to save member: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error saving member:", error);
        setMessage("Failed to save member.");
      }
    } else {
      setMessage("Please fill in all fields!");
    }
  };
 
  const deleteMember = async (id) => {
    try {
      const response = await fetch(`https://project-management-backend-tool.onrender.com/api/team/members/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Member deleted successfully!");
        fetchTeamMembers(); // Refresh the list
      } else {
        setMessage("Failed to delete member.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      setMessage("Failed to delete member.");
    }
  };

  const editMember = (member) => {
    setNewMember(member); 
    setEditMemberId(member._id); 
    setFormVisible(true); 
  };

  return (
    <div className="teams-page">
      <h1>Teams</h1>
      {message && <div className="message">{message}</div>} {/* Display message */}
      <button className="add-member-btn" onClick={toggleForm}>
        <FaUserPlus className="icon" /> {editMemberId ? "Edit Team Member" : "Add Team Member"}
      </button>

      {/* Form to Add/Edit Team Member */}
      {formVisible && (
        <div className="add-member-form">
          <h3>
            <FaUserCircle className="icon" />
            {editMemberId ? "Edit Team Member" : "Add New Team Member"}
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={newMember.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (e.g., React, CSS)"
            value={newMember.skills}
            onChange={handleInputChange}
          />
          <div className="input-icon-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newMember.email}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="number"
            name="experience"
            placeholder="Years of Experience"
            value={newMember.experience}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="position"
            placeholder="Position (e.g., Developer)"
            value={newMember.position}
            onChange={handleInputChange}
          />
          <button className="save-btn" onClick={saveMember}>
            <FaSave className="icon" /> {editMemberId ? "Update" : "Save"}
          </button>
        </div>
      )}

      {/* Table of Team Members */}
      <table className="team-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Skills</th>
            <th>Email</th>
            <th>Experience (Years)</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.skills}</td>
              <td>{member.email}</td>
              <td>{member.experience}</td>
              <td>{member.position}</td>
              <td>
                <button className="edit-btn" onClick={() => editMember(member)}>
                  <FaEdit className="icon" />
                </button>
                <button className="delete-btn" onClick={() => deleteMember(member._id)}>
                  <FaTrash className="icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teams;
