import React, { useState } from "react";
import { FaUserPlus, FaSave, FaEnvelope, FaUserCircle } from "react-icons/fa";

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    skills: "",
    email: "",
    experience: "",
    position: "",
  });

  // Toggle form visibility
  const toggleForm = () => setFormVisible(!formVisible);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  // Add new member to the table
  const saveMember = () => {
    const { name, skills, email, experience, position } = newMember;

    if (name && skills && email && experience && position) {
      setTeamMembers((prev) => [...prev, newMember]);
      setNewMember({ name: "", skills: "", email: "", experience: "", position: "" });
      setFormVisible(false);
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="teams-page">
      <h1>Teams</h1>
      <button className="add-member-btn" onClick={toggleForm}>
        <FaUserPlus className="icon" /> Add Team Member
      </button>

      {/* Form to Add Team Member */}
      {formVisible && (
        <div className="add-member-form">
          <h3>
            <FaUserCircle className="icon" />
            Add New Team Member
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
            <FaSave className="icon" /> Save
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
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member, index) => (
            <tr key={index}>
              <td>{member.name}</td>
              <td>{member.skills}</td>
              <td>{member.email}</td>
              <td>{member.experience}</td>
              <td>{member.position}</td>
              <td className="user-icon">
                <FaUserCircle />
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Teams;