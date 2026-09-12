import { useEffect, useState } from "react";
import API from "../services/api";

function ReceptionDashboard() {
    const [bookings, setBookings] = useState([]);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            let url = "/bookings/dashboard/staff";

            const params = [];

            if (status) {
                params.push(
                    `status=${encodeURIComponent(status)}`
                );
            }

            if (search.trim()) {
                params.push(
                    `search=${encodeURIComponent(
                        search.trim()
                    )}`
                );
            }

            if (params.length > 0) {
                url += "?" + params.join("&");
            }

            const response = await API.get(url);

            setBookings(
                response.data.bookings || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                    "Unable to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, [status]);

    return (
        <div className="page">

            <div className="dashboard-header">
                <div>
                    <h1>Reception Dashboard</h1>
                    <p>
                        View and manage hotel bookings
                    </p>
                </div>

                <button
                    onClick={loadBookings}
                >
                    Refresh
                </button>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="filters">

                <input
                    type="text"
                    placeholder="Search Booking ID"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="">
                        All Bookings
                    </option>

                    <option value="CONFIRMED">
                        Confirmed
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>

                    <option value="COMPLETED">
                        Completed
                    </option>
                </select>

                <button
                    onClick={loadBookings}
                >
                    Search
                </button>

            </div>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            {/* SUMMARY */}
            <div className="summary-grid">

                <div className="summary-card">
                    <h3>Total Bookings</h3>
                    <p>{bookings.length}</p>
                </div>

                <div className="summary-card">
                    <h3>Confirmed</h3>
                    <p>
                        {
                            bookings.filter(
                                (booking) =>
                                    booking.bookingStatus ===
                                    "CONFIRMED"
                            ).length
                        }
                    </p>
                </div>

                <div className="summary-card">
                    <h3>Cancelled</h3>
                    <p>
                        {
                            bookings.filter(
                                (booking) =>
                                    booking.bookingStatus ===
                                    "CANCELLED"
                            ).length
                        }
                    </p>
                </div>

                <div className="summary-card">
                    <h3>Completed</h3>
                    <p>
                        {
                            bookings.filter(
                                (booking) =>
                                    booking.bookingStatus ===
                                    "COMPLETED"
                            ).length
                        }
                    </p>
                </div>

            </div>

            {/* BOOKINGS TABLE */}
            <div className="table-container">

                <h2>Bookings</h2>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <p>
                        No bookings found.
                    </p>
                ) : (
                    <table>

                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Hotel</th>
                                <th>Room</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Guests</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {bookings.map(
                                (booking) => (
                                    <tr
                                        key={
                                            booking._id
                                        }
                                    >

                                        <td>
                                            {
                                                booking.bookingId
                                            }
                                        </td>

                                        <td>
                                            {
                                                booking.hotelId ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {booking.roomId
                                                ?.roomNumber ||
                                                "N/A"}
                                        </td>

                                        <td>
                                            {new Date(
                                                booking.checkInDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {new Date(
                                                booking.checkOutDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {
                                                booking.numberOfGuests
                                            }
                                        </td>

                                        <td>
                                            ₹
                                            {
                                                booking.totalAmount
                                            }
                                        </td>

                                        <td>
                                            <span
                                                className={`booking-status ${booking.bookingStatus.toLowerCase()}`}
                                            >
                                                {
                                                    booking.bookingStatus
                                                }
                                            </span>
                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>
                )}

            </div>

        </div>
    );
}

export default ReceptionDashboard;