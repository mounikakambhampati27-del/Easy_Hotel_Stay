import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SearchRooms() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        organizationId: "ORG001",
        hotelId: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1
    });

    const [rooms, setRooms] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const searchRooms = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setRooms([]);
        setSearched(false);

        if (!form.checkInDate || !form.checkOutDate) {
            setError("Please select check-in and check-out dates.");
            return;
        }

        if (form.checkInDate >= form.checkOutDate) {
            setError("Check-out date must be after check-in date.");
            return;
        }

        try {
            setLoading(true);

            const response = await API.get("/bookings/search", {
                params: {
                    organizationId: form.organizationId,
                    hotelId: form.hotelId,
                    checkInDate: form.checkInDate,
                    checkOutDate: form.checkOutDate,
                    numberOfGuests: Number(form.numberOfGuests)
                }
            });

            console.log("Search response:", response.data);

            const result =
                response.data.rooms ||
                response.data.availableRooms ||
                response.data ||
                [];

            setRooms(Array.isArray(result) ? result : []);

            setSearched(true);

        } catch (err) {
            console.error("Search rooms error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to search available rooms."
            );
        } finally {
            setLoading(false);
        }
    };

    const bookRoom = async (room) => {
        setError("");
        setMessage("");

        try {
            const bookingData = {
                organizationId: form.organizationId,
                hotelId:
                    form.hotelId ||
                    room.hotelId,
                roomId: room._id,
                checkInDate: form.checkInDate,
                checkOutDate: form.checkOutDate,
                numberOfGuests: Number(form.numberOfGuests)
            };

            console.log("Booking data:", bookingData);

            const response = await API.post(
                "/bookings",
                bookingData
            );

            console.log(
                "Booking response:",
                response.data
            );

            setMessage(
                `Booking successful! Booking ID: ${
                    response.data.booking?.bookingId ||
                    response.data.bookingId ||
                    "Created"
                }`
            );

            // Refresh search results after booking
            searchAgain();

        } catch (err) {
            console.error("Booking error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to create booking."
            );
        }
    };

    const searchAgain = async () => {
        try {
            const response = await API.get(
                "/bookings/search",
                {
                    params: {
                        organizationId: form.organizationId,
                        hotelId: form.hotelId,
                        checkInDate: form.checkInDate,
                        checkOutDate: form.checkOutDate,
                        numberOfGuests:
                            Number(form.numberOfGuests)
                    }
                }
            );

            const result =
                response.data.rooms ||
                response.data.availableRooms ||
                response.data ||
                [];

            setRooms(
                Array.isArray(result)
                    ? result
                    : []
            );

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={pageStyle}>

            {/* HEADER */}

            <div style={headerStyle}>
                <div>
                    <h1>Search Available Rooms</h1>

                    <p>
                        Select your organization, hotel,
                        dates and number of guests.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/customer-dashboard")
                    }
                    style={secondaryButton}
                >
                    Dashboard
                </button>
            </div>

            {/* SEARCH FORM */}

            <div style={cardStyle}>

                <h2>Find a Room</h2>

                <form onSubmit={searchRooms}>

                    <div style={gridStyle}>

                        <div>
                            <label>
                                Organization ID
                            </label>

                            <input
                                type="text"
                                name="organizationId"
                                value={
                                    form.organizationId
                                }
                                onChange={handleChange}
                                placeholder="ORG001"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label>
                                Hotel ID
                            </label>

                            <input
                                type="text"
                                name="hotelId"
                                value={form.hotelId}
                                onChange={handleChange}
                                placeholder="HGMUM001"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label>
                                Check-in Date
                            </label>

                            <input
                                type="date"
                                name="checkInDate"
                                value={
                                    form.checkInDate
                                }
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label>
                                Check-out Date
                            </label>

                            <input
                                type="date"
                                name="checkOutDate"
                                value={
                                    form.checkOutDate
                                }
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label>
                                Number of Guests
                            </label>

                            <input
                                type="number"
                                name="numberOfGuests"
                                min="1"
                                value={
                                    form.numberOfGuests
                                }
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >
                        {loading
                            ? "Searching..."
                            : "Search Available Rooms"}
                    </button>

                </form>
            </div>

            {/* MESSAGES */}

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            {message && (
                <div style={successStyle}>
                    {message}
                </div>
            )}

            {/* RESULTS */}

            {searched && (
                <div style={cardStyle}>

                    <h2>
                        Available Rooms
                    </h2>

                    {rooms.length === 0 ? (
                        <div style={emptyStyle}>
                            <h3>
                                No rooms available
                            </h3>

                            <p>
                                Try different dates,
                                hotel or number of guests.
                            </p>
                        </div>
                    ) : (
                        <div style={roomsGrid}>

                            {rooms.map((room) => (
                                <div
                                    key={room._id}
                                    style={roomCardStyle}
                                >

                                    <h2>
                                        Room{" "}
                                        {room.roomNumber ||
                                            room.roomId}
                                    </h2>

                                    <p>
                                        <strong>
                                            Type:
                                        </strong>{" "}
                                        {room.roomType ||
                                            "Standard"}
                                    </p>

                                    <p>
                                        <strong>
                                            Capacity:
                                        </strong>{" "}
                                        {room.capacity} guests
                                    </p>

                                    <p>
                                        <strong>
                                            Price:
                                        </strong>{" "}
                                        ₹
                                        {
                                            room.pricePerNight
                                        }
                                        / night
                                    </p>

                                    <p>
                                        <strong>
                                            Hotel:
                                        </strong>{" "}
                                        {room.hotelId ||
                                            form.hotelId}
                                    </p>

                                    {room.description && (
                                        <p>
                                            {
                                                room.description
                                            }
                                        </p>
                                    )}

                                    <p>
                                        <strong>
                                            Amenities:
                                        </strong>{" "}
                                        {room.amenities?.join(
                                            ", "
                                        ) ||
                                            "Wi-Fi, AC, TV"}
                                    </p>

                                    <button
                                        onClick={() =>
                                            bookRoom(room)
                                        }
                                        style={buttonStyle}
                                    >
                                        Book This Room
                                    </button>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}


/* ============================= */
/* STYLES */
/* ============================= */

const pageStyle = {
    minHeight: "100vh",
    padding: "30px",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
    boxSizing: "border-box"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
};

const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "25px"
};

const roomsGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
};

const roomCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    background: "#fff"
};

const inputStyle = {
    width: "100%",
    padding: "11px",
    marginTop: "7px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px"
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

const secondaryButton = {
    padding: "12px 20px",
    background: "#374151",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const errorStyle = {
    padding: "14px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "6px",
    marginBottom: "20px"
};

const successStyle = {
    padding: "14px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "6px",
    marginBottom: "20px"
};

const emptyStyle = {
    padding: "25px",
    textAlign: "center",
    background: "#f9fafb",
    borderRadius: "8px"
};

export default SearchRooms;