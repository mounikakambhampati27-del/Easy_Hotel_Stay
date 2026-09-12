import { useEffect, useState } from "react";
import API from "../services/api";
import BookingCard from "../components/BookingCard";

function MyBookings() {
    const [bookings, setBookings] =
        useState([]);

    const loadBookings = async () => {
        try {
            const response =
                await API.get(
                    "/bookings/my"
                );

            setBookings(
                response.data.bookings
            );
        } catch (error) {
            console.error(
                error.response?.data ||
                    error.message
            );
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const cancelBooking =
        async (bookingId) => {
            try {
                await API.patch(
                    `/bookings/${bookingId}/cancel`
                );

                alert(
                    "Booking cancelled"
                );

                loadBookings();

            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                        "Cancellation failed"
                );
            }
        };

    return (
        <div className="page">

            <h1>
                My Bookings
            </h1>

            <div className="booking-grid">

                {bookings.map(
                    (booking) => (
                        <div
                            key={booking._id}
                        >

                            <BookingCard
                                booking={
                                    booking
                                }
                            />

                            {booking.bookingStatus ===
                                "CONFIRMED" && (
                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        cancelBooking(
                                            booking.bookingId
                                        )
                                    }
                                >
                                    Cancel Booking
                                </button>
                            )}

                        </div>
                    )
                )}

            </div>

        </div>
    );
}

export default MyBookings;