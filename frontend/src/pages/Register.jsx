import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await API.post("/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password
            });

            console.log("Register response:", response.data);

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setForm({
                name: "",
                email: "",
                password: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            console.error("Register error:", err);

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fb",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    width: "420px",
                    maxWidth: "100%",
                    background: "white",
                    padding: "35px",
                    borderRadius: "12px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
                    boxSizing: "border-box"
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        margin: "0 0 8px",
                        color: "#111827"
                    }}
                >
                    Easy HotelStay
                </h1>

                <h2
                    style={{
                        textAlign: "center",
                        margin: "0 0 8px",
                        color: "#2563eb"
                    }}
                >
                    Create Account
                </h2>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "25px"
                    }}
                >
                    Register as a customer
                </p>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "18px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        style={{
                            background: "#dcfce7",
                            color: "#166534",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "18px"
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontWeight: "bold"
                            }}
                        >
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontWeight: "bold"
                            }}
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "22px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontWeight: "bold"
                            }}
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            minLength="6"
                            required
                            style={inputStyle}
                        />

                        <small
                            style={{
                                color: "#666"
                            }}
                        >
                            Minimum 6 characters
                        </small>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: loading
                                ? "#93c5fd"
                                : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "22px",
                        color: "#666"
                    }}
                >
                    Already have an account?{" "}

                    <span
                        onClick={() => navigate("/login")}
                        style={{
                            color: "#2563eb",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px"
};

export default Register;