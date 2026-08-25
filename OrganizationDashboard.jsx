/* OrganizationDashboard.jsx
 * Organization Dashboard - main landing page for organizations.
 * Author: Samukelisiwe Maphumulo 219344639
 * Date: August 2026
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";

const OrganizationDashboard = () => {
  const [orgName] = useState("Groote Schuur Hospital");

  const stats = [
    { label: "Active Bookings", value: 5, color: "#1a73e8" },
    { label: "Available Professionals", value: 24, color: "#34a853" },
    { label: "Pending Requests", value: 3, color: "#fbbc04" },
    { label: "Completed Bookings", value: 18, color: "#ea4335" },
  ];

  const quickLinks = [
    { label: "Browse Candidates", path: "/browse-candidates" },
    { label: "Current Bookings", path: "/current-bookings" },
    { label: "Booking History", path: "/booking-history" },
    { label: "Organization Profile", path: "/organization-profile" },
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

      {/* Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <h2 style={styles.welcomeText}>
          Welcome, {orgName} 👋
        </h2>
        <p style={styles.welcomeSubtext}>
          Manage your professionals and bookings from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            ...styles.statCard,
            borderTop: `4px solid ${stat.color}`
          }}>
            <p style={styles.statValue}>{stat.value}</p>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.quickLinksGrid}>
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.path} style={styles.quickLink}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <span style={styles.activityDot} />
            <p style={styles.activityText}>
              Booking request sent to Nurse Lindiwe Dlamini
            </p>
            <span style={styles.activityTime}>2 hours ago</span>
          </div>
          <div style={styles.activityItem}>
            <span style={styles.activityDot} />
            <p style={styles.activityText}>
              Booking confirmed for ICU Night Shift
            </p>
            <span style={styles.activityTime}>5 hours ago</span>
          </div>
          <div style={styles.activityItem}>
            <span style={styles.activityDot} />
            <p style={styles.activityText}>
              Profile updated successfully
            </p>
            <span style={styles.activityTime}>Yesterday</span>
          </div>
        </div>
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
  welcomeBanner: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  welcomeText: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#1a73e8",
  },
  welcomeSubtext: {
    margin: "5px 0 0",
    color: "#666",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#666",
    margin: "5px 0 0",
  },
  section: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    margin: "0 0 15px",
    color: "#333",
    fontSize: "1.1rem",
  },
  quickLinksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },
  quickLink: {
    backgroundColor: "#1a73e8",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f5f7fa",
    borderRadius: "8px",
  },
  activityDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#1a73e8",
    flexShrink: 0,
  },
  activityText: {
    margin: 0,
    flex: 1,
    fontSize: "0.9rem",
    color: "#333",
  },
  activityTime: {
    fontSize: "0.8rem",
    color: "#999",
  },
};

export default OrganizationDashboard;