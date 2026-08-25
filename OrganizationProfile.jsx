/* OrganizationProfile.jsx
 * Organization Profile - allows organizations to view and update their profile.
 * Author: Samukelisiwe Maphumulo 219344639
 * Date: August 2026
 */
import React, { useState } from "react";

const OrganizationProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    organizationName: "Groote Schuur Hospital",
    organizationType: "Hospital",
    address: "Main Road, Observatory",
    city: "Cape Town",
    contactPerson: "Dr. Samukelisiwe Maphumulo",
    contactEmail: "admin@gsh.co.za",
    contactPhone: "021 404 4911",
    registrationNumber: "REG-2024-001",
    description: "A leading public hospital in Cape Town providing world class healthcare services.",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const orgTypes = [
    "Hospital",
    "School",
    "Pharmacy",
    "Clinic",
    "University",
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>HERMS</h1>
        <p style={styles.headerSubtitle}>
          Healthcare & Education Resource Management System
        </p>
      </div>

      {/* Page Title */}
      <div style={styles.pageTitleRow}>
        <h2 style={styles.pageTitle}>Organization Profile</h2>
        {!isEditing && (
          <button
            style={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div style={styles.card}>

        {/* Organization Avatar */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {profile.organizationName.charAt(0)}
          </div>
          <div>
            <h3 style={styles.orgName}>{profile.organizationName}</h3>
            <span style={styles.orgTypeBadge}>
              {profile.organizationType}
            </span>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Profile Fields */}
        <div style={styles.fieldsGrid}>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Organization Name</label>
            {isEditing ? (
              <input
                style={styles.input}
                name="organizationName"
                value={editedProfile.organizationName}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.organizationName}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Organization Type</label>
            {isEditing ? (
              <select
                style={styles.input}
                name="organizationType"
                value={editedProfile.organizationType}
                onChange={handleChange}
              >
                {orgTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <p style={styles.value}>{profile.organizationType}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address</label>
            {isEditing ? (
              <input
                style={styles.input}
                name="address"
                value={editedProfile.address}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.address}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>City</label>
            {isEditing ? (
              <input
                style={styles.input}
                name="city"
                value={editedProfile.city}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.city}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contact Person</label>
            {isEditing ? (
              <input
                style={styles.input}
                name="contactPerson"
                value={editedProfile.contactPerson}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.contactPerson}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contact Email</label>
            {isEditing ? (
              <input
                style={styles.input}
                name="contactEmail"
                value={editedProfile.contactEmail}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.contactEmail}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contact Phone</label>
            {isEditing ? (
              <input
                style={styles.input}
                name="contactPhone"
                value={editedProfile.contactPhone}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.contactPhone}</p>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Registration Number</label>
            <p style={styles.value}>{profile.registrationNumber}</p>
          </div>

          <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Description</label>
            {isEditing ? (
              <textarea
                style={{ ...styles.input, height: "80px", resize: "vertical" }}
                name="description"
                value={editedProfile.description}
                onChange={handleChange}
              />
            ) : (
              <p style={styles.value}>{profile.description}</p>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={styles.buttonRow}>
            <button style={styles.saveButton} onClick={handleSave}>
              💾 Save Changes
            </button>
            <button style={styles.cancelButton} onClick={handleCancel}>
              ✕ Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#1a73e8",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "2rem",
    margin: 0,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: "0.9rem",
    margin: "5px 0 0",
    opacity: 0.9,
  },
  pageTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  pageTitle: {
    margin: 0,
    color: "#333",
    fontSize: "1.5rem",
  },
  editButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#1a73e8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  orgName: {
    margin: "0 0 8px",
    fontSize: "1.3rem",
    color: "#333",
  },
  orgTypeBadge: {
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "20px 0",
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "0.8rem",
    color: "#999",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  value: {
    margin: 0,
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
  },
  saveButton: {
    backgroundColor: "#34a853",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ea4335",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
  },
};

export default OrganizationProfile;