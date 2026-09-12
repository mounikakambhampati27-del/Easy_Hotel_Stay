import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2>Easy HotelStay</h2>

            <div className="nav-links">

                {role === "customer" && (
                    <>
                        <Link to="/search">Search Rooms</Link>
                        <Link to="/customer-dashboard">Dashboard</Link>
                        <Link to="/my-bookings">My Bookings</Link>
                    </>
                )}

                {role === "admin" && (
                    <>
                        <Link to="/admin-dashboard">
                            Admin Dashboard
                        </Link>

                        <Link to="/organizations">
                            Organizations
                        </Link>

                        <Link to="/hotels">
                            Hotels
                        </Link>

                        <Link to="/rooms">
                            Rooms
                        </Link>
                    </>
                )}

                {role === "receptionist" && (
                    <>
                        <Link to="/reception-dashboard">
                            Reception Dashboard
                        </Link>

                        <Link to="/hotels">
                            Hotels
                        </Link>

                        <Link to="/rooms">
                            Rooms
                        </Link>
                    </>
                )}

                <button onClick={logout} className="logout-btn">
                    Logout
                </button>

            </div>
        </nav>
    );
}

export default Navbar;