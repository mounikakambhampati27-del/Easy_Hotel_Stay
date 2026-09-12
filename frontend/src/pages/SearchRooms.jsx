import { useState } from "react";
import API from "../services/api";

function SearchRooms() {
    const [form, setForm] =
        useState({
            checkInDate: "",
            checkOutDate: "",
            numberOfGuests: 1
        });

    const [rooms, setRooms] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const searchRooms = async (e) => {
        e.preventDefault();

        try {
            const response =
                await API.get(
                    "/bookings/search",
                    {
                        params: form
                    }
                );

            setRooms(
                response.data.rooms
            );

            setMessage(
                `${response.data.count} rooms available`
            );

        } catch (error) {
            setMessage(
                error.response?.data
                    ?.message ||
                    "Search failed"
            );
        }
    };

    const bookRoom = async (room) => {
        try {
            const hotelId =
                room.hotelId;

            const response =
                await API.post(
                    "/bookings",
                    {
                        roomId: room._id,
                        hotelId,
                        organizationId:
                            room.organizationId,

                        checkInDate:
                            form.checkInDate,

                        checkOutDate:
                            form.checkOutDate,

                        numberOfGuests:
                            Number(
                                form.numberOfGuests
                            )
                    }
                );

            alert(
                `Booking successful! Booking ID: ${response.data.booking.bookingId}`
            );

            setRooms(
                rooms.filter(
                    (r) =>
                        r._id !== room._id
                )
            );

        } catch (error) {
            alert(
                error.response?.data
                    ?.message ||
                    "Booking failed"
            );
        }
    };

    return (
        <div className="page">

            <h1>
                Search Available Rooms
            </h1>

            <form
                className="search-form"
                onSubmit={searchRooms}
            >

                <label>
                    Check-in
                    <input
                        type="date"
                        name="checkInDate"
                        value={
                            form.checkInDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />
                </label>

                <label>
                    Check-out
                    <input
                        type="date"
                        name="checkOutDate"
                        value={
                            form.checkOutDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />
                </label>

                <label>
                    Guests
                    <input
                        type="number"
                        name="numberOfGuests"
                        min="1"
                        value={
                            form.numberOfGuests
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />
                </label>

                <button type="submit">
                    Search
                </button>

            </form>

            {message && (
                <h3>
                    {message}
                </h3>
            )}

            <div className="room-grid">

                {rooms.map(
                    (room) => (
                        <div
                            className="room-card"
                            key={room._id}
                        >

                            <h2>
                                Room{" "}
                                {
                                    room.roomNumber
                                }
                            </h2>

                            <p>
                                Type:{" "}
                                {
                                    room.roomType
                                }
                            </p>

                            <p>
                                Capacity:{" "}
                                {
                                    room.capacity
                                }
                            </p>

                            <p>
                                Price: ₹
                                {
                                    room.pricePerNight
                                }{" "}
                                / night
                            </p>

                            <p>
                                {
                                    room.description
                                }
                            </p>

                            <p>
                                Amenities:{" "}
                                {
                                    room.amenities?.join(
                                        ", "
                                    )
                                }
                            </p>

                            <button
                                onClick={() =>
                                    bookRoom(
                                        room
                                    )
                                }
                            >
                                Book Room
                            </button>

                        </div>
                    )
                )}

            </div>

        </div>
    );
}

export default SearchRooms;