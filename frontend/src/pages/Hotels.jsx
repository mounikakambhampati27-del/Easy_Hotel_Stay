import { useEffect, useState } from "react";
import API from "../services/api";

function Hotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        hotelId: "",
        organizationId: "ORG001",
        hotelName: "",
        address: "",
        city: "",
        description: "",
        contactNumber: "",
        email: ""
    });

    const loadHotels = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/hotel/organization/${form.organizationId}`
            );

            setHotels(response.data.hotels || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load hotels"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHotels();
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
            await API.post("/hotel", form);

            setMessage("Hotel created successfully!");

            setForm({
                hotelId: "",
                organizationId: form.organizationId,
                hotelName: "",
                address: "",
                city: "",
                description: "",
                contactNumber: "",
                email: ""
            });

            loadHotels();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create hotel"
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
            <h1>Hotel Management</h1>

            <p>
                Create and view hotels belonging to an organization.
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

            {/* CREATE HOTEL */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px",
                    marginBottom: "30px"
                }}
            >
                <h2>Add New Hotel</h2>

                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Hotel ID</label>
                        <input
                            type="text"
                            name="hotelId"
                            value={form.hotelId}
                            onChange={handleChange}
                            placeholder="Example: HYSKY002"
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
                            placeholder="Example: ORG001"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Hotel Name</label>
                        <input
                            type="text"
                            name="hotelName"
                            value={form.hotelName}
                            onChange={handleChange}
                            placeholder="Hotel name"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Hotel address"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="City"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Hotel description"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={form.contactNumber}
                            onChange={handleChange}
                            placeholder="Contact number"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Hotel email"
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                    >
                        Create Hotel
                    </button>

                </form>
            </div>

            {/* HOTEL LIST */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px"
                }}
            >
                <h2>Hotels</h2>

                {loading ? (
                    <p>Loading hotels...</p>
                ) : hotels.length === 0 ? (
                    <p>No hotels found.</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "20px"
                        }}
                    >
                        {hotels.map((hotel) => (
                            <div
                                key={hotel._id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "20px",
                                    borderRadius: "8px"
                                }}
                            >
                                <h3>{hotel.hotelName}</h3>

                                <p>
                                    <strong>ID:</strong>{" "}
                                    {hotel.hotelId}
                                </p>

                                <p>
                                    <strong>Organization:</strong>{" "}
                                    {hotel.organizationId}
                                </p>

                                <p>
                                    <strong>Address:</strong>{" "}
                                    {hotel.address}
                                </p>

                                <p>
                                    <strong>City:</strong>{" "}
                                    {hotel.city}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {hotel.status}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={loadHotels}
                    style={{
                        ...buttonStyle,
                        marginTop: "20px"
                    }}
                >
                    Refresh Hotels
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

export default Hotels;