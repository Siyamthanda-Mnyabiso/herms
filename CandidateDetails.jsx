/* CandidateDetails.jsx
 * Candidate Details - shows detailed info about a professional.
 * Identity is hidden until booking is confirmed.
 * Author: Samukelisiwe Maphumulo 219344639
 * Date: August 2026
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CandidateDetails = () => {
  const navigate = useNavigate();
  const [bookingRequested, setBookingRequested] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const candidate = {
    id: "PROF-001",
    profession: "Nurse",
    specialization: "ICU",
    qualification: "Bachelor of Nursing",
    yearsOfExperience: 5,
    availability: "Available",
    city: "Cape Town",
    rating: 4.8,
    totalReviews: 24,
    skills: [
      "Critical Care",
      "Ventilator Management",
      "Patient Monitoring",
      "IV Therapy",
      "Emergency Response",
    ],
    certifications: [
      "SANC Registered",
      "BLS Certified",
      "ACLS Certified",
    ],
    availableShifts: [
      { date: "2026-09-01", startTime: "07:00", endTime: "19:00", type: "Day Shift" },
      { date: "2026-09-02", startTime: "19:00", endTime: "07:00", type: "Night Shift" },
      { date: "2026-09-03", startTime: "07:00", endTime: "19:00", type: "Day Shift" },
    ],
    reviews: [
      { rating: 5, comment: "Excellent professional, very reliable.", organization: "Organization A" },
      { rating: 5, comment: "Great work ethic and very skilled.", organization: "Organization B" },
      { rating: 4, comment: "Very good, would recommend.", organization: "Organization C" },
    ],
  };

  const handleBookingRequest = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setBookingRequested(true);
    setShowConfirm(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#fbbc04" : "#ddd" }}>★</span>
    ));
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

      {/* Back Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate("/browse-candidates")}
      >
        ← Back to Browse
      </button>

      {/* Identity Hidden Notice */}
      {!bookingRequested && (
        <div style={styles.hiddenNotice}>
          🔒 This professional's identity is hidden until a booking is confirmed.
          You can view their qualifications, skills and availability below.
        </div>
      )}

      {/* Identity Revealed Notice */}
      {bookingRequested && (
        <div style={styles.revealedNotice}>
          ✅ Booking request sent! Identity will be revealed once confirmed.
        </div>
      )}

      <div style={styles.contentGrid}>

        {/* Left Column */}
        <div style={styles.leftColumn}>

          {/* Profile Card */}
          <div style={styles.card}>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>?</div>
              <div>
                <p style={styles.anonymousLabel}>🔒 Anonymous Professional</p>
                <span style={styles.professionBadge}>
                  {candidate.profession}
                </span>
              </div>
            </div>

            <div style={styles.ratingRow}>
              <span style={styles.ratingStars}>
                {renderStars(Math.round(candidate.rating))}
              </span>
              <span style={styles.ratingText}>
                {candidate.rating} ({candidate.totalReviews} reviews)
              </span>
            </div>

            <div style={{
              ...styles.availabilityBadge,
              backgroundColor: candidate.availability === "Available"
                ? "#34a853" : "#ea4335"
            }}>
              {candidate.availability}
            </div>

            {/* Book Button */}
            {!bookingRequested ? (
              <button
                style={styles.bookButton}
                onClick={handleBookingRequest}
              >
                📅 Send Booking Request
              </button>
            ) : (
              <button style={styles.requestedButton} disabled>
                ✅ Request Sent
              </button>
            )}
          </div>

          {/* Quick Info Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Quick Info</h3>
            <div style={styles.infoList}>
              <div style={styles.infoRow}>
                <span style={styles.infoKey}>Profession</span>
                <span style={styles.infoValue}>{candidate.profession}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoKey}>Specialization</span>
                <span style={styles.infoValue}>{candidate.specialization}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoKey}>Qualification</span>
                <span style={styles.infoValue}>{candidate.qualification}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoKey}>Experience</span>
                <span style={styles.infoValue}>
                  {candidate.yearsOfExperience} years
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoKey}>City</span>
                <span style={styles.infoValue}>{candidate.city}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>

          {/* Skills Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Skills</h3>
            <div style={styles.skillsGrid}>
              {candidate.skills.map((skill, i) => (
                <span key={i} style={styles.skillBadge}>{skill}</span>
              ))}
            </div>
          </div>

          {/* Certifications Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Certifications</h3>
            <div style={styles.certList}>
              {candidate.certifications.map((cert, i) => (
                <div key={i} style={styles.certItem}>
                  <span style={styles.certIcon}>✅</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Available Shifts</h3>
            <div style={styles.shiftsList}>
              {candidate.availableShifts.map((shift, i) => (
                <div key={i} style={styles.shiftItem}>
                  <div style={styles.shiftDate}>{shift.date}</div>
                  <div style={styles.shiftInfo}>
                    <span style={styles.shiftType}>{shift.type}</span>
                    <span style={styles.shiftTime}>
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Reviews</h3>
            <div style={styles.reviewsList}>
              {candidate.reviews.map((review, i) => (
                <div key={i} style={styles.reviewItem}>
                  <div style={styles.reviewHeader}>
                    <span>{renderStars(review.rating)}</span>
                    <span style={styles.reviewOrg}>
                      {review.organization}
                    </span>
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirm Booking Request</h3>
            <p style={styles.modalText}>
              Are you sure you want to send a booking request to this professional?
              Their identity will be revealed once the booking is confirmed.
            </p>
            <div style={styles.modalButtons}>
              <button style={styles.confirmButton} onClick={handleConfirm}>
                ✅ Yes, Send Request
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
  backButton: {
    backgroundColor: "transparent",
    border: "1px solid #1a73e8",
    color: "#1a73e8",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "15px",
    fontSize: "0.9rem",
  },
  hiddenNotice: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },
  revealedNotice: {
    backgroundColor: "#e6f4ea",
    color: "#34a853",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "20px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    margin: "0 0 15px",
    color: "#333",
    fontSize: "1rem",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    color: "#999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  anonymousLabel: {
    margin: "0 0 8px",
    fontSize: "0.85rem",
    color: "#999",
  },
  professionBadge: {
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "15px",
  },
  ratingStars: {
    fontSize: "1.2rem",
  },
  ratingText: {
    fontSize: "0.85rem",
    color: "#666",
  },
  availabilityBadge: {
    color: "white",
    padding: "6px 15px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "15px",
  },
  bookButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
    width: "100%",
  },
  requestedButton: {
    backgroundColor: "#34a853",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "bold",
    width: "100%",
    cursor: "not-allowed",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    borderBottom: "1px solid #f5f5f5",
    paddingBottom: "8px",
  },
  infoKey: {
    color: "#999",
    fontWeight: "bold",
  },
  infoValue: {
    color: "#333",
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillBadge: {
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  certList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  certItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#333",
  },
  certIcon: {
    fontSize: "1rem",
  },
  shiftsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  shiftItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "10px",
    backgroundColor: "#f5f7fa",
    borderRadius: "8px",
  },
  shiftDate: {
    fontWeight: "bold",
    color: "#1a73e8",
    fontSize: "0.9rem",
    minWidth: "90px",
  },
  shiftInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  shiftType: {
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "#333",
  },
  shiftTime: {
    fontSize: "0.8rem",
    color: "#666",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  reviewItem: {
    padding: "12px",
    backgroundColor: "#f5f7fa",
    borderRadius: "8px",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  reviewOrg: {
    fontSize: "0.8rem",
    color: "#999",
  },
  reviewComment: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#333",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    margin: "0 0 15px",
    color: "#333",
    fontSize: "1.2rem",
  },
  modalText: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
  },
  confirmButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#ea4335",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    flex: 1,
  },
};

export default CandidateDetails;