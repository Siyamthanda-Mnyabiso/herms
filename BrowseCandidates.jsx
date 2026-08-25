/* BrowseCandidates.jsx
 * Browse Candidates - allows organizations to browse available professionals.
 * Note: Professional identity is hidden until booking is confirmed.
 * Author: Samukelisiwe Maphumulo 219344639
 * Date: August 2026
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BrowseCandidates = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    profession: "",
    specialization: "",
    availability: "",
    city: "",
  });

  const [candidates] = useState([
    {
      id: "PROF-001",
      profession: "Nurse",
      specialization: "ICU",
      qualification: "Bachelor of Nursing",
      yearsOfExperience: 5,
      availability: "Available",
      city: "Cape Town",
      skills: ["Critical Care", "Ventilator Management", "Patient Monitoring"],
      rating: 4.8,
    },
    {
      id: "PROF-002",
      profession: "Nurse",
      specialization: "Paediatrics",
      qualification: "Diploma in Nursing",
      yearsOfExperience: 3,
      availability: "Available",
      city: "Cape Town",
      skills: ["Child Care", "Neonatal", "Immunization"],
      rating: 4.5,
    },
    {
      id: "PROF-003",
      profession: "Teacher",
      specialization: "Mathematics",
      qualification: "PGCE",
      yearsOfExperience: 7,
      availability: "Available",
      city: "Johannesburg",
      skills: ["Grade 10-12", "Calculus", "Statistics"],
      rating: 4.9,
    },
    {
      id: "PROF-004",
      profession: "Pharmacist",
      specialization: "Clinical Pharmacy",
      qualification: "BPharm",
      yearsOfExperience: 4,
      availability: "Unavailable",
      city: "Cape Town",
      skills: ["Drug Dispensing", "Patient Counselling", "Stock Control"],
      rating: 4.6,
    },
    {
      id: "PROF-005",
      profession: "Nurse",
      specialization: "Emergency",
      qualification: "Bachelor of Nursing",
      yearsOfExperience: 6,
      availability: "Available",
      city: "Durban",
      skills: ["Trauma Care", "Triage", "Emergency Response"],
      rating: 4.7,
    },
    {
      id: "PROF-006",
      profession: "Teacher",
      specialization: "Science",
      qualification: "BSc Education",
      yearsOfExperience: 2,
      availability: "Available",
      city: "Cape Town",
      skills: ["Physics", "Chemistry", "Biology"],
      rating: 4.3,
    },
  ]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      profession: "",
      specialization: "",
      availability: "",
      city: "",
    });
  };

  const filteredCandidates = candidates.filter((c) => {
    return (
      (filters.profession === "" ||
        c.profession.toLowerCase().includes(
          filters.profession.toLowerCase())) &&
      (filters.specialization === "" ||
        c.specialization.toLowerCase().includes(
          filters.specialization.toLowerCase())) &&
      (filters.availability === "" ||
        c.availability === filters.availability) &&
      (filters.city === "" ||
        c.city.toLowerCase().includes(filters.city.toLowerCase()))
    );
  });

  const getAvailabilityColor = (status) => {
    return status === "Available" ? "#34a853" : "#ea4335";
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.round(rating));
  };

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
      <h2 style={styles.pageTitle}>Browse Available Professionals</h2>
      <p style={styles.pageSubtitle}>
        ⚠️ Professional identities are hidden until a booking is confirmed.
      </p>

      {/* Filters */}
      <div style={styles.filtersCard}>
        <h3 style={styles.filtersTitle}>🔍 Filter Candidates</h3>
        <div style={styles.filtersGrid}>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Profession</label>
            <select
              style={styles.filterInput}
              name="profession"
              value={filters.profession}
              onChange={handleFilterChange}
            >
              <option value="">All Professions</option>
              <option value="Nurse">Nurse</option>
              <option value="Teacher">Teacher</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Specialization</label>
            <input
              style={styles.filterInput}
              name="specialization"
              placeholder="e.g. ICU, Mathematics"
              value={filters.specialization}
              onChange={handleFilterChange}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Availability</label>
            <select
              style={styles.filterInput}
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>City</label>
            <input
              style={styles.filterInput}
              name="city"
              placeholder="e.g. Cape Town"
              value={filters.city}
              onChange={handleFilterChange}
            />
          </div>

        </div>
        <button style={styles.clearButton} onClick={clearFilters}>
          ✕ Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <p style={styles.resultsCount}>
        Showing <strong>{filteredCandidates.length}</strong> professionals
      </p>

      {/* Candidates Grid */}
      <div style={styles.candidatesGrid}>
        {filteredCandidates.length === 0 ? (
          <div style={styles.noResults}>
            <p>😕 No professionals found matching your filters.</p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <div key={candidate.id} style={styles.candidateCard}>

              {/* Anonymous Avatar */}
              <div style={styles.anonymousAvatar}>?</div>

              {/* Anonymous Label */}
              <p style={styles.anonymousLabel}>
                🔒 Identity Hidden
              </p>

              {/* Profession Badge */}
              <span style={{
                ...styles.professionBadge,
                backgroundColor:
                  candidate.profession === "Nurse" ? "#e8f0fe" :
                  candidate.profession === "Teacher" ? "#fce8e6" : "#e6f4ea",
                color:
                  candidate.profession === "Nurse" ? "#1a73e8" :
                  candidate.profession === "Teacher" ? "#ea4335" : "#34a853",
              }}>
                {candidate.profession}
              </span>

              {/* Details */}
              <div style={styles.detailsSection}>
                <p style={styles.detailRow}>
                  <span style={styles.detailKey}>Specialization:</span>
                  <span>{candidate.specialization}</span>
                </p>
                <p style={styles.detailRow}>
                  <span style={styles.detailKey}>Qualification:</span>
                  <span>{candidate.qualification}</span>
                </p>
                <p style={styles.detailRow}>
                  <span style={styles.detailKey}>Experience:</span>
                  <span>{candidate.yearsOfExperience} years</span>
                </p>
                <p style={styles.detailRow}>
                  <span style={styles.detailKey}>City:</span>
                  <span>{candidate.city}</span>
                </p>
                <p style={styles.detailRow}>
                  <span style={styles.detailKey}>Rating:</span>
                  <span>{renderStars(candidate.rating)} ({candidate.rating})</span>
                </p>
              </div>

              {/* Skills */}
              <div style={styles.skillsSection}>
                {candidate.skills.map((skill, i) => (
                  <span key={i} style={styles.skillBadge}>{skill}</span>
                ))}
              </div>

              {/* Availability */}
              <div style={{
                ...styles.availabilityBadge,
                backgroundColor: getAvailabilityColor(candidate.availability),
              }}>
                {candidate.availability}
              </div>

              {/* View Details Button */}
              <button
                style={styles.viewButton}
                onClick={() => navigate(`/candidate-details/${candidate.id}`)}
              >
                View Details →
              </button>

            </div>
          ))
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
  pageTitle: {
    fontSize: "1.5rem",
    color: "#333",
    margin: "0 0 5px",
  },
  pageSubtitle: {
    color: "#e65100",
    fontSize: "0.9rem",
    marginBottom: "20px",
    backgroundColor: "#fff3e0",
    padding: "10px 15px",
    borderRadius: "8px",
  },
  filtersCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  filtersTitle: {
    margin: "0 0 15px",
    color: "#333",
    fontSize: "1rem",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "15px",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  filterLabel: {
    fontSize: "0.8rem",
    color: "#666",
    fontWeight: "bold",
  },
  filterInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    outline: "none",
  },
  clearButton: {
    backgroundColor: "#ea4335",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  resultsCount: {
    color: "#666",
    marginBottom: "15px",
    fontSize: "0.9rem",
  },
  candidatesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  candidateCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  anonymousAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    color: "#999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  anonymousLabel: {
    fontSize: "0.8rem",
    color: "#999",
    margin: 0,
  },
  professionBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  detailsSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
    fontSize: "0.85rem",
    color: "#333",
  },
  detailKey: {
    color: "#999",
    fontWeight: "bold",
  },
  skillsSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    width: "100%",
  },
  skillBadge: {
    backgroundColor: "#f5f7fa",
    color: "#555",
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    border: "1px solid #ddd",
  },
  availabilityBadge: {
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  viewButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    width: "100%",
  },
  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#666",
    backgroundColor: "white",
    borderRadius: "10px",
  },
};

export default BrowseCandidates;