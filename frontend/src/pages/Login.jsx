import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", {
                email: email.trim(),
                password: password
            });

            console.log("Login response:", response.data);

            const data = response.data;

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Get user information
            const user = data.user || {};

            const role = user.role || data.role;

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem("role", role);

            // Redirect according to role
            if (role === "admin") {
                navigate("/admin-dashboard");
            } else if (role === "receptionist") {
                navigate("/reception-dashboard");
            } else if (role === "customer") {
                navigate("/customer-dashboard");
            } else {
                setError("Invalid user role.");
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.response?.data?.message ||
                "Login failed. Please check your email and password."
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
                fontFamily: "Arial"
            }}
        >
            <div
                style={{
                    width: "400px",
                    padding: "35px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    Easy HotelStay
                </h1>

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >
                    Login
                </h2>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "20px"
                        }}
                    >
                        {error}
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
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                boxSizing: "border-box",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "15px"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
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
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                boxSizing: "border-box",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "15px"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                        color: "#666"
                    }}
                >
                    Don't have an account?{" "}

                    <span
                        onClick={() => navigate("/register")}
                        style={{
                            color: "#2563eb",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Register
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Login;