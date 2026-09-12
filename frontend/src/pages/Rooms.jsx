import { useEffect, useState } from "react";
import API from "../services/api";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        roomId: "",
        organizationId: "ORG001",
        hotelId: "",
        roomNumber: "",
        roomType: "",
        capacity: 1,
        pricePerNight: "",
        availabilityStatus: "Available",
        description: "",
        amenities: ""
    });

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/rooms");

            setRooms(
                response.data.rooms ||
                response.data ||
                []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load rooms"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const roomData = {
                ...form,
                capacity: Number(form.capacity),
                pricePerNight: Number(form.pricePerNight),
                amenities: form.amenities
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
            };

            await API.post("/rooms", roomData);

            setMessage("Room created successfully!");

            setForm({
                roomId: "",
                organizationId: form.organizationId,
                hotelId: form.hotelId,
                roomNumber: "",
                roomType: "",
                capacity: 1,
                pricePerNight: "",
                availabilityStatus: "Available",
                description: "",
                amenities: ""
            });

            loadRooms();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create room"
            );
        }
    };

    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial",
                color: "black",
                background: "#f5f7fb",
                minHeight: "100vh"
            }}
        >
            <h1>Room Management</h1>

            <p>
                Create and manage rooms for your hotels.
            </p>

            {message && (
                <div
                    style={{
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "6px"
                    }}
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "6px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* CREATE ROOM */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px",
                    marginBottom: "30px"
                }}
            >
                <h2>Add New Room</h2>

                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Room ID</label>
                        <input
                            type="text"
                            name="roomId"
                            value={form.roomId}
                            onChange={handleChange}
                            placeholder="Example: SKY102"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Organization ID</label>
                        <input
                            type="text"
                            name="organizationId"
                            value={form.organizationId}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Hotel ID</label>
                        <input
                            type="text"
                            name="hotelId"
                            value={form.hotelId}
                            onChange={handleChange}
                            placeholder="Example: HYSKY001"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Room Number</label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={form.roomNumber}
                            onChange={handleChange}
                            placeholder="Example: 102"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Room Type</label>
                        <input
                            type="text"
                            name="roomType"
                            value={form.roomType}
                            onChange={handleChange}
                            placeholder="Deluxe / Suite / Standard"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={form.capacity}
                            onChange={handleChange}
                            min="1"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Price Per Night</label>
                        <input
                            type="number"
                            name="pricePerNight"
                            value={form.pricePerNight}
                            onChange={handleChange}
                            min="0"
                            placeholder="5000"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Availability</label>

                        <select
                            name="availabilityStatus"
                            value={form.availabilityStatus}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="Available">
                                Available
                            </option>

                            <option value="Unavailable">
                                Unavailable
                            </option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Room description"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Amenities</label>

                        <input
                            type="text"
                            name="amenities"
                            value={form.amenities}
                            onChange={handleChange}
                            placeholder="Wi-Fi, AC, TV, Breakfast"
                            style={inputStyle}
                        />

                        <small>
                            Separate amenities with commas.
                        </small>
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                    >
                        Create Room
                    </button>

                </form>
            </div>

            {/* ROOM LIST */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px"
                }}
            >
                <h2>Rooms</h2>

                {loading ? (
                    <p>Loading rooms...</p>
                ) : rooms.length === 0 ? (
                    <p>No rooms found.</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "20px"
                        }}
                    >
                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "20px",
                                    borderRadius: "8px"
                                }}
                            >
                                <h3>
                                    Room {room.roomNumber}
                                </h3>

                                <p>
                                    <strong>Room ID:</strong>{" "}
                                    {room.roomId}
                                </p>

                                <p>
                                    <strong>Hotel:</strong>{" "}
                                    {room.hotelId}
                                </p>

                                <p>
                                    <strong>Type:</strong>{" "}
                                    {room.roomType}
                                </p>

                                <p>
                                    <strong>Capacity:</strong>{" "}
                                    {room.capacity}
                                </p>

                                <p>
                                    <strong>Price:</strong>{" "}
                                    ₹{room.pricePerNight}
                                    /night
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {room.availabilityStatus}
                                </p>

                                <p>
                                    <strong>Amenities:</strong>{" "}
                                    {room.amenities?.join(", ") ||
                                        "None"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={loadRooms}
                    style={{
                        ...buttonStyle,
                        marginTop: "20px"
                    }}
                >
                    Refresh Rooms
                </button>
            </div>
        </div>
    );
}

const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "5px",
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

export default Rooms;