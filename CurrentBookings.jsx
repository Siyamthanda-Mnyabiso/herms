/* CurrentBookings.jsx
 * Current Bookings - shows all active bookings for the organization.
 * Author: Samukelisiwe Maphumulo 219344639
 * Date: August 2026
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CurrentBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([
    {
      id: "BOOK-001",
      professionalID: "PROF-001",
      profession: "Nurse",
      specialization: "ICU",
      shiftDate: "2026-09-01",
      startTime: "07:00",
      endTime: "19:00",
      shiftType: "Day Shift",
      department: "Intensive Care Unit",
      hourlyRate: 180,
      status: "Confirmed",
      identityRevealed: true,
      professionalName: "Lindiwe Dlamini",
    },
    {
      id: "BOOK-002",
      professionalID: "PROF-002",
      profession: "Nurse",
      specialization: "Paediatrics",
      shiftDate: "2026-09-02",
      startTime: "19:00",
      endTime: "07:00",
      shiftType: "Night Shift",
      department: "Paediatrics Ward",
      hourlyRate: 160,
      status: "Pending",
      identityRevealed: false,
      professionalName: null,
    },
    {
      id: "BOOK-003",
      professionalID: "PROF-003",
      profession: "Teacher",
      specialization: "Mathematics",
      shiftDate: "2026-09-03",
      startTime: "08:00",
      endTime: "15:00",
      shiftType: "Day Shift",
      department: "Grade 12",
      hourlyRate: 200,
      status: "Confirmed",
      identityRevealed: true,
      professionalName: "Thabo Nkosi",
    },
    {
      id: "BOOK-004",
      professionalID: "PROF-004",
      profession: "Pharmacist",
      specialization: "Clinical Pharmacy",
      shiftDate: "2026-09-04",
      startTime: "09:00",
      endTime: "17:00",
      shiftType: "Day Shift",
      department: "Pharmacy",
      hourlyRate: 220,
      status: "Pending",
      identityRevealed: false,
      professionalName: null,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");

  const handleCancel = (bookingID) => {
    setBookings(bookings.filter((b) => b.id !== bookingID));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "#34a853";
      case "Pending": return "#fbbc04";
      case "Cancelled": return "#ea4335";
      default: return "#999";
    }
  };

  const calculateTotalHours = (start, end) => {
    const startHour = parseInt(start.split(":")[0]);
    const endHour = parseInt(end.split(":")[0]);
    const hours = endHour > startHour
      ? endHour - startHour
      : 24 - startHour + endHour;
    return hours;
  };

  const filteredBookings = filterStatus === "All"
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>HERMS</h1>
        <p style={styles.headerSubtitle}>
          Healthcare & Education Resource Management System
        </p>
      </div>

      {/* Page Title Row */}
      <div style={styles.pageTitleRow}>
        <h2 style={styles.pageTitle}>Current Bookings</h2>
        <button
          style={styles.browseButton}
          onClick={() => navigate("/browse-candidates")}
        >
          + New Booking
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #1a73e8" }}>
          <p style={styles.summaryValue}>{bookings.length}</p>
          <p style={styles.summaryLabel}>Total Bookings</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #34a853" }}>
          <p style={styles.summaryValue}>
            {bookings.filter((b) => b.status === "Confirmed").length}
          </p>
          <p style={styles.summaryLabel}>Confirmed</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #fbbc04" }}>
          <p style={styles.summaryValue}>
            {bookings.filter((b) => b.status === "Pending").length}
          </p>
          <p style={styles.summaryLabel}>Pending</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #ea4335" }}>
          <p style={styles.summaryValue}>
            R{bookings.reduce((total, b) => {
              const hours = calculateTotalHours(b.startTime, b.endTime);
              return total + (hours * b.hourlyRate);
            }, 0).toLocaleString()}
          </p>
          <p style={styles.summaryLabel}>Total Cost</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {["All", "Confirmed", "Pending"].map((status) => (
          <button
            key={status}
            style={{
              ...styles.filterTab,
              backgroundColor: filterStatus === status ? "#1a73e8" : "white",
              color: filterStatus === status ? "white" : "#333",
            }}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div style={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <div style={styles.noResults}>
            <p>😕 No bookings found.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} style={styles.bookingCard}>

              {/* Left Section */}
              <div style={styles.bookingLeft}>
                <div style={styles.bookingAvatar}>
                  {booking.identityRevealed
                    ? booking.professionalName.charAt(0)
                    : "?"}
                </div>
                <div>
                  <p style={styles.bookingName}>
                    {booking.identityRevealed
                      ? booking.professionalName
                      : "🔒 Identity Hidden"}
                  </p>
                  <span style={styles.professionBadge}>
                    {booking.profession}
                  </span>
                </div>
              </div>

              {/* Middle Section */}
              <div style={styles.bookingMiddle}>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailKey}>Specialization</span>
                  <span style={styles.detailValue}>
                    {booking.specialization}
                  </span>
                </div>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailKey}>Department</span>
                  <span style={styles.detailValue}>{booking.department}</span>
                </div>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailKey}>Date</span>
                  <span style={styles.detailValue}>{booking.shiftDate}</span>
                </div>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailKey}>Shift</span>
                  <span style={styles.detailValue}>
                    {booking.shiftType} ({booking.startTime} - {booking.endTime})
                  </span>
                </div>
              </div>

              {/* Right Section */}
              <div style={styles.bookingRight}>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(booking.status),
                }}>
                  {booking.status}
                </div>
                <p style={styles.rateText}>
                  R{booking.hourlyRate}/hr
                </p>
                <p style={styles.totalText}>
                  Total: R{(
                    calculateTotalHours(booking.startTime, booking.endTime)
                    * booking.hourlyRate
                  ).toLocaleString()}
                </p>
                {booking.status === "Pending" && (
                  <button
                    style={styles.cancelButton}
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>

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
  browseButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },
  summaryCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  summaryValue: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },
  summaryLabel: {
    fontSize: "0.85rem",
    color: "#666",
    margin: "5px 0 0",
  },
  filterTabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  filterTab: {
    padding: "8px 20px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  bookingCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  bookingLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: "200px",
  },
  bookingAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#1a73e8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    fontWeight: "bold",
    flexShrink: 0,
  },
  bookingName: {
    margin: "0 0 6px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "0.95rem",
  },
  professionBadge: {
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  bookingMiddle: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
  },
  bookingDetail: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  detailKey: {
    fontSize: "0.75rem",
    color: "#999",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: "0.9rem",
    color: "#333",
  },
  bookingRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    minWidth: "120px",
  },
  statusBadge: {
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  rateText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#666",
  },
  totalText: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: "bold",
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "#ea4335",
    color: "white",
    border: "none",
    padding: "6px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
    backgroundColor: "white",
    borderRadius: "10px",
  },
};

export default CurrentBookings;