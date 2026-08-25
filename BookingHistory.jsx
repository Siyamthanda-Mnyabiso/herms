/* BookingHistory.jsx
 * Booking History - shows all previous/completed bookings for the organization.
 * Author: Samukelisiwe Maphumulo 219344639
 * Date: August 2026
 */
import React, { useState } from "react";

const BookingHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProfession, setFilterProfession] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [history] = useState([
    {
      id: "BOOK-H001",
      profession: "Nurse",
      specialization: "ICU",
      professionalName: "Lindiwe Dlamini",
      shiftDate: "2026-08-01",
      startTime: "07:00",
      endTime: "19:00",
      shiftType: "Day Shift",
      department: "Intensive Care Unit",
      hourlyRate: 180,
      status: "Completed",
      rating: 5,
      review: "Excellent professional, very reliable.",
    },
    {
      id: "BOOK-H002",
      profession: "Teacher",
      specialization: "Mathematics",
      professionalName: "Thabo Nkosi",
      shiftDate: "2026-08-05",
      startTime: "08:00",
      endTime: "15:00",
      shiftType: "Day Shift",
      department: "Grade 12",
      hourlyRate: 200,
      status: "Completed",
      rating: 4,
      review: "Very good teacher, students responded well.",
    },
    {
      id: "BOOK-H003",
      profession: "Pharmacist",
      specialization: "Clinical Pharmacy",
      professionalName: "Amara Osei",
      shiftDate: "2026-08-10",
      startTime: "09:00",
      endTime: "17:00",
      shiftType: "Day Shift",
      department: "Pharmacy",
      hourlyRate: 220,
      status: "Completed",
      rating: 5,
      review: "Outstanding service and very knowledgeable.",
    },
    {
      id: "BOOK-H004",
      profession: "Nurse",
      specialization: "Emergency",
      professionalName: "Sipho Mokoena",
      shiftDate: "2026-08-15",
      startTime: "19:00",
      endTime: "07:00",
      shiftType: "Night Shift",
      department: "Emergency",
      hourlyRate: 190,
      status: "Cancelled",
      rating: null,
      review: null,
    },
    {
      id: "BOOK-H005",
      profession: "Nurse",
      specialization: "Paediatrics",
      professionalName: "Nomsa Dube",
      shiftDate: "2026-08-20",
      startTime: "07:00",
      endTime: "19:00",
      shiftType: "Day Shift",
      department: "Paediatrics Ward",
      hourlyRate: 160,
      status: "Completed",
      rating: 4,
      review: "Great with children, very caring.",
    },
    {
      id: "BOOK-H006",
      profession: "Teacher",
      specialization: "Science",
      professionalName: "Kagiso Sithole",
      shiftDate: "2026-08-22",
      startTime: "08:00",
      endTime: "15:00",
      shiftType: "Day Shift",
      department: "Grade 10",
      hourlyRate: 180,
      status: "Completed",
      rating: 5,
      review: "Brilliant teacher, highly recommended.",
    },
  ]);

  const calculateHours = (start, end) => {
    const s = parseInt(start.split(":")[0]);
    const e = parseInt(end.split(":")[0]);
    return e > s ? e - s : 24 - s + e;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "#34a853";
      case "Cancelled": return "#ea4335";
      default: return "#999";
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "N/A";
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#fbbc04" : "#ddd" }}>
        ★
      </span>
    ));
  };

  const filteredHistory = history
    .filter((b) => {
      const matchSearch =
        b.professionalName.toLowerCase().includes(
          searchTerm.toLowerCase()) ||
        b.specialization.toLowerCase().includes(
          searchTerm.toLowerCase()) ||
        b.department.toLowerCase().includes(
          searchTerm.toLowerCase());
      const matchProfession =
        filterProfession === "All" ||
        b.profession === filterProfession;
      return matchSearch && matchProfession;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.shiftDate) - new Date(a.shiftDate);
      if (sortBy === "oldest")
        return new Date(a.shiftDate) - new Date(b.shiftDate);
      if (sortBy === "highest-rate")
        return b.hourlyRate - a.hourlyRate;
      return 0;
    });

  const totalSpent = history
    .filter((b) => b.status === "Completed")
    .reduce((total, b) => {
      return total + calculateHours(b.startTime, b.endTime) * b.hourlyRate;
    }, 0);

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
      <h2 style={styles.pageTitle}>Booking History</h2>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #1a73e8" }}>
          <p style={styles.summaryValue}>{history.length}</p>
          <p style={styles.summaryLabel}>Total Bookings</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #34a853" }}>
          <p style={styles.summaryValue}>
            {history.filter((b) => b.status === "Completed").length}
          </p>
          <p style={styles.summaryLabel}>Completed</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #ea4335" }}>
          <p style={styles.summaryValue}>
            {history.filter((b) => b.status === "Cancelled").length}
          </p>
          <p style={styles.summaryLabel}>Cancelled</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: "4px solid #fbbc04" }}>
          <p style={styles.summaryValue}>
            R{totalSpent.toLocaleString()}
          </p>
          <p style={styles.summaryLabel}>Total Spent</p>
        </div>
      </div>

      {/* Filters Row */}
      <div style={styles.filtersRow}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search by name, specialization or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={styles.filterSelect}
          value={filterProfession}
          onChange={(e) => setFilterProfession(e.target.value)}
        >
          <option value="All">All Professions</option>
          <option value="Nurse">Nurse</option>
          <option value="Teacher">Teacher</option>
          <option value="Pharmacist">Pharmacist</option>
        </select>
        <select
          style={styles.filterSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest-rate">Highest Rate</option>
        </select>
      </div>

      {/* Results Count */}
      <p style={styles.resultsCount}>
        Showing <strong>{filteredHistory.length}</strong> bookings
      </p>

      {/* History List */}
      <div style={styles.historyList}>
        {filteredHistory.length === 0 ? (
          <div style={styles.noResults}>
            <p>😕 No bookings found.</p>
          </div>
        ) : (
          filteredHistory.map((booking) => (
            <div key={booking.id} style={styles.bookingCard}>

              {/* Left */}
              <div style={styles.bookingLeft}>
                <div style={styles.avatar}>
                  {booking.professionalName.charAt(0)}
                </div>
                <div>
                  <p style={styles.professionalName}>
                    {booking.professionalName}
                  </p>
                  <span style={styles.professionBadge}>
                    {booking.profession}
                  </span>
                </div>
              </div>

              {/* Middle */}
              <div style={styles.bookingMiddle}>
                <div style={styles.detailItem}>
                  <span style={styles.detailKey}>Specialization</span>
                  <span style={styles.detailValue}>
                    {booking.specialization}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailKey}>Department</span>
                  <span style={styles.detailValue}>
                    {booking.department}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailKey}>Date</span>
                  <span style={styles.detailValue}>
                    {booking.shiftDate}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailKey}>Shift</span>
                  <span style={styles.detailValue}>
                    {booking.shiftType} ({booking.startTime} - {booking.endTime})
                  </span>
                </div>
              </div>

              {/* Right */}
              <div style={styles.bookingRight}>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(booking.status),
                }}>
                  {booking.status}
                </div>
                <p style={styles.rateText}>R{booking.hourlyRate}/hr</p>
                <p style={styles.totalText}>
                  R{(
                    calculateHours(booking.startTime, booking.endTime)
                    * booking.hourlyRate
                  ).toLocaleString()}
                </p>
                {booking.rating && (
                  <div style={styles.ratingRow}>
                    {renderStars(booking.rating)}
                  </div>
                )}
              </div>

              {/* Review Section */}
              {booking.review && (
                <div style={styles.reviewSection}>
                  <p style={styles.reviewText}>
                    💬 "{booking.review}"
                  </p>
                </div>
              )}

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
    margin: "0 0 20px",
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
  filtersRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  searchInput: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    outline: "none",
  },
  filterSelect: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    outline: "none",
    cursor: "pointer",
  },
  resultsCount: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "15px",
  },
  historyList: {
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
    flexWrap: "wrap",
  },
  bookingLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "200px",
  },
  avatar: {
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
  professionalName: {
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
    minWidth: "300px",
  },
  detailItem: {
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
    gap: "6px",
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
  ratingRow: {
    fontSize: "1rem",
  },
  reviewSection: {
    width: "100%",
    backgroundColor: "#f5f7fa",
    padding: "10px 15px",
    borderRadius: "8px",
    borderLeft: "3px solid #1a73e8",
  },
  reviewText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#555",
    fontStyle: "italic",
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
    backgroundColor: "white",
    borderRadius: "10px",
  },
};

export default BookingHistory;