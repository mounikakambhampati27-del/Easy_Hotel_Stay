import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";

import Organizations from "./pages/Organizations";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import SearchRooms from "./pages/SearchRooms";
import MyBookings from "./pages/MyBookings";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/customer-dashboard"
                    element={<CustomerDashboard />}
                />

                <Route
                    path="/reception-dashboard"
                    element={<ReceptionDashboard />}
                />

                <Route
                    path="/organizations"
                    element={<Organizations />}
                />

                <Route
                    path="/hotels"
                    element={<Hotels />}
                />

                <Route
                    path="/rooms"
                    element={<Rooms />}
                />

                <Route
                    path="/search"
                    element={<SearchRooms />}
                />

                <Route
                    path="/my-bookings"
                    element={<MyBookings />}
                />

                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;