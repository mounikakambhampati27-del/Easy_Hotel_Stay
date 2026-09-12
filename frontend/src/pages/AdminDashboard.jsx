import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [organizations, setOrganizations] = useState([]);

    const [bookingError, setBookingError] = useState("");
    const [organizationError, setOrganizationError] = useState("");

    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        setLoading(true);

        setBookingError("");
        setOrganizationError("");

        // Load bookings
        try {
            const response = await API.get(
                "/bookings/dashboard/staff"
            );

            console.log(
                "Staff dashboard response:",
                response.data
            );

            setBookings(
                response.data.bookings || []
            );
        } catch (error) {
            console.error(
                "BOOKING API ERROR:",
                error.response?.data || error.message
            );

            setBookingError(
                `Status: ${error.response?.status || "Unknown"} | ` +
                `${
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load bookings"
                }`
            );
        }

        // Load organizations
        try {
            const response = await API.get(
                "/organizations"
            );

            console.log(
                "Organizations response:",
                response.data
            );

            setOrganizations(
                response.data.organizations || []
            );
        } catch (error) {
            console.error(
                "ORGANIZATION API ERROR:",
                error.response?.data || error.message
            );

            setOrganizationError(
                `Status: ${error.response?.status || "Unknown"} | ` +
                `${
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load organizations"
                }`
            );
        }

        setLoading(false);
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    padding: "40px",
                    fontFamily: "Arial"
                }}
            >
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial",
                background: "#f5f7fb",
                minHeight: "100vh",
                color: "black"
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px"
                }}
            >
                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage organizations, hotels,
                        rooms and bookings
                    </p>
                </div>

                <button
                    onClick={loadDashboard}
                    style={buttonStyle}
                >
                    Refresh
                </button>
            </div>

            {/* ERRORS */}

            {bookingError && (
                <div style={errorStyle}>
                    <strong>Booking Error:</strong>{" "}
                    {bookingError}
                </div>
            )}

            {organizationError && (
                <div style={errorStyle}>
                    <strong>Organization Error:</strong>{" "}
                    {organizationError}
                </div>
            )}

            {/* SUMMARY CARDS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >
                <SummaryCard
                    title="Total Organizations"
                    value={organizations.length}
                />

                <SummaryCard
                    title="Total Bookings"
                    value={bookings.length}
                />

                <SummaryCard
                    title="Confirmed"
                    value={
                        bookings.filter(
                            (booking) =>
                                booking.bookingStatus ===
                                "CONFIRMED"
                        ).length
                    }
                />

                <SummaryCard
                    title="Cancelled"
                    value={
                        bookings.filter(
                            (booking) =>
                                booking.bookingStatus ===
                                "CANCELLED"
                        ).length
                    }
                />
            </div>

            {/* ORGANIZATIONS */}

            <div style={sectionStyle}>
                <h2>Organizations</h2>

                {organizations.length === 0 ? (
                    <p>No organizations found.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={cellStyle}>
                                        Organization ID
                                    </th>

                                    <th style={cellStyle}>
                                        Name
                                    </th>

                                    <th style={cellStyle}>
                                        Description
                                    </th>

                                    <th style={cellStyle}>
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {organizations.map(
                                    (organization) => (
                                        <tr
                                            key={
                                                organization._id
                                            }
                                        >
                                            <td
                                                style={
                                                    cellStyle
                                                }
                                            >
                                                {
                                                    organization.organizationId
                                                }
                                            </td>

                                            <td
                                                style={
                                                    cellStyle
                                                }
                                            >
                                                {
                                                    organization.name
                                                }
                                            </td>

                                            <td
                                                style={
                                                    cellStyle
                                                }
                                            >
                                                {
                                                    organization.description ||
                                                    "N/A"
                                                }
                                            </td>

                                            <td
                                                style={
                                                    cellStyle
                                                }
                                            >
                                                {
                                                    organization.status
                                                }
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* BOOKINGS */}

            <div style={sectionStyle}>
                <h2>Recent Bookings</h2>

                {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={cellStyle}>
                                        Booking ID
                                    </th>

                                    <th style={cellStyle}>
                                        Hotel
                                    </th>

                                    <th style={cellStyle}>
                                        Room
                                    </th>

                                    <th style={cellStyle}>
                                        Check-in
                                    </th>

                                    <th style={cellStyle}>
                                        Check-out
                                    </th>

                                    <th style={cellStyle}>
                                        Guests
                                    </th>

                                    <th style={cellStyle}>
                                        Amount
                                    </th>

                                    <th style={cellStyle}>
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                    >
                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            {
                                                booking.bookingId
                                            }
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            {
                                                booking.hotelId ||
                                                "N/A"
                                            }
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            {
                                                booking.roomId
                                                    ?.roomNumber ||
                                                "N/A"
                                            }
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            {new Date(
                                                booking.checkInDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            {new Date(
                                                booking.checkOutDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            {
                                                booking.numberOfGuests
                                            }
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            ₹
                                            {
                                                booking.totalAmount
                                            }
                                        </td>

                                        <td
                                            style={
                                                cellStyle
                                            }
                                        >
                                            <span
                                                style={{
                                                    padding:
                                                        "5px 10px",
                                                    borderRadius:
                                                        "5px",
                                                    background:
                                                        booking.bookingStatus ===
                                                        "CONFIRMED"
                                                            ? "#dcfce7"
                                                            : booking.bookingStatus ===
                                                                "CANCELLED"
                                                              ? "#fee2e2"
                                                              : "#e0e7ff"
                                                }}
                                            >
                                                {
                                                    booking.bookingStatus
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div
            style={{
                background: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow:
                    "0 3px 12px rgba(0,0,0,0.08)"
            }}
        >
            <h3>{title}</h3>

            <h1
                style={{
                    fontSize: "35px",
                    margin: "10px 0"
                }}
            >
                {value}
            </h1>
        </div>
    );
}

const sectionStyle = {
    background: "white",
    padding: "25px",
    marginBottom: "30px",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px"
};

const cellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
};

const buttonStyle = {
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px"
};

const errorStyle = {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px"
};

export default AdminDashboard;