import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CustomerDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        upcomingBookings: [],
        historicalBookings: [],
        cancelledBookings: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                "/bookings/dashboard/customer"
            );

            setDashboard(response.data);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // =========================
    // CANCEL BOOKING
    // =========================

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            `Are you sure you want to cancel booking ${bookingId}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await API.patch(
                `/bookings/${bookingId}/cancel`
            );

            alert(
                `Booking ${bookingId} cancelled successfully.`
            );

            // Refresh dashboard so booking moves
            // from Upcoming to Cancelled
            await loadDashboard();

        } catch (err) {
            console.error("Cancel booking error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to cancel booking"
            );
        }
    };

    if (loading) {
        return (
            <div style={pageStyle}>
                <h2>Loading Customer Dashboard...</h2>
            </div>
        );
    }

    return (
        <div style={pageStyle}>

            {/* ================= HEADER ================= */}

            <div style={headerStyle}>

                <div>
                    <h1>Customer Dashboard</h1>

                    <p>
                        Manage your hotel bookings
                    </p>
                </div>

                <button
                    onClick={() => navigate("/search")}
                    style={buttonStyle}
                >
                    Search Rooms
                </button>

            </div>


            {/* ================= ERROR ================= */}

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}


            {/* ================= UPCOMING ================= */}

            <section style={sectionStyle}>

                <h2>Upcoming Bookings</h2>

                {dashboard.upcomingBookings.length === 0 ? (

                    <div style={emptyStyle}>

                        <h3>
                            No upcoming bookings
                        </h3>

                        <p>
                            You don't have any upcoming
                            reservations.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/search")
                            }
                            style={buttonStyle}
                        >
                            Book a Room
                        </button>

                    </div>

                ) : (

                    <BookingList
                        bookings={
                            dashboard.upcomingBookings
                        }
                        onCancel={handleCancel}
                    />

                )}

            </section>


            {/* ================= HISTORICAL ================= */}

            <section style={sectionStyle}>

                <h2>
                    Historical / Completed
                </h2>

                {dashboard.historicalBookings.length === 0 ? (

                    <div style={emptyStyle}>

                        <p>
                            No historical bookings.
                        </p>

                    </div>

                ) : (

                    <BookingList
                        bookings={
                            dashboard.historicalBookings
                        }
                    />

                )}

            </section>


            {/* ================= CANCELLED ================= */}

            <section style={sectionStyle}>

                <h2>
                    Cancelled Bookings
                </h2>

                {dashboard.cancelledBookings.length === 0 ? (

                    <div style={emptyStyle}>

                        <p>
                            No cancelled bookings.
                        </p>

                    </div>

                ) : (

                    <BookingList
                        bookings={
                            dashboard.cancelledBookings
                        }
                    />

                )}

            </section>


            {/* ================= REFRESH ================= */}

            <button
                onClick={loadDashboard}
                style={{
                    ...buttonStyle,
                    background: "#374151"
                }}
            >
                Refresh Dashboard
            </button>

        </div>
    );
}


/* =====================================================
   BOOKING LIST
===================================================== */

function BookingList({
    bookings,
    onCancel
}) {

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
            }}
        >

            {bookings.map((booking) => (

                <div
                    key={booking._id}
                    style={cardStyle}
                >

                    <h3>
                        Booking #{booking.bookingId}
                    </h3>


                    <p>
                        <strong>Hotel:</strong>{" "}
                        {booking.hotelId}
                    </p>


                    <p>
                        <strong>Room:</strong>{" "}
                        {booking.roomId?.roomNumber ||
                            "N/A"}
                    </p>


                    <p>
                        <strong>Check-in:</strong>{" "}
                        {new Date(
                            booking.checkInDate
                        ).toLocaleDateString()}
                    </p>


                    <p>
                        <strong>Check-out:</strong>{" "}
                        {new Date(
                            booking.checkOutDate
                        ).toLocaleDateString()}
                    </p>


                    <p>
                        <strong>Guests:</strong>{" "}
                        {booking.numberOfGuests}
                    </p>


                    <p>
                        <strong>Total:</strong>{" "}
                        ₹{booking.totalAmount}
                    </p>


                    <p>
                        <strong>Status:</strong>{" "}
                        {booking.bookingStatus}
                    </p>


                    {/* =========================
                        CANCEL BUTTON
                    ========================= */}

                    {booking.bookingStatus ===
                        "CONFIRMED" &&
                        onCancel && (

                            <button
                                onClick={() =>
                                    onCancel(
                                        booking.bookingId
                                    )
                                }
                                style={cancelButtonStyle}
                            >
                                Cancel Booking
                            </button>

                        )}

                </div>

            ))}

        </div>
    );
}


/* =====================================================
   STYLES
===================================================== */

const pageStyle = {
    minHeight: "100vh",
    padding: "35px",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
    boxSizing: "border-box"
};


const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px"
};


const sectionStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
};


const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    background: "#fff"
};


const emptyStyle = {
    padding: "25px",
    textAlign: "center",
    background: "#f9fafb",
    borderRadius: "8px"
};


const buttonStyle = {
    padding: "12px 22px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px"
};


const cancelButtonStyle = {
    width: "100%",
    marginTop: "15px",
    padding: "11px 18px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold"
};


const errorStyle = {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px"
};


export default CustomerDashboard;