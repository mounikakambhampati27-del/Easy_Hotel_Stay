function BookingCard({ booking }) {
    return (
        <div className="booking-card">

            <h3>
                Booking #
                {booking.bookingId}
            </h3>

            <p>
                <strong>Room:</strong>{" "}
                {booking.roomId?.roomNumber ||
                    "N/A"}
            </p>

            <p>
                <strong>Type:</strong>{" "}
                {booking.roomId?.roomType ||
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
                <strong>Amount:</strong> ₹
                {booking.totalAmount}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                <span className="status">
                    {booking.bookingStatus}
                </span>
            </p>

        </div>
    );
}

export default BookingCard;