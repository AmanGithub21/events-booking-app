import React, { Component } from "react";
import BookingList from "../components/Bookings/BookingsList";

import AuthContext from "../components/context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class BookingsPage extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            bookings: [],
        };
    }
    componentDidMount() {
        this.fetchBooking();
    }
    fetchBooking = async () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                        }
                    }
                }
            `,
        };
        const token = this.context.token;
        const res = await fetch(
            "https://eventsbookingapp.herokuapp.com/graphql",
            {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            }
        );
        if (res) {
            if (res.status !== 200 && res.status !== 201)
                throw new Error("Failed!");
            const resData = await res.json();
            this.setState({
                bookings: resData.data.bookings,
                isLoading: false,
            });
        }
    };
    deleteBookingHandler = async (bookingId) => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
                    }
                }
            `,
        };
        const res = await fetch(
            "https://eventsbookingapp.herokuapp.com/graphql",
            {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.context.token,
                },
            }
        );
        if (res.status !== 200 && res.status !== 201) {
            this.setState({ isLoading: false });
            throw new Error("Failed in deleting Booking");
        }
        const updatedBookings = this.state.bookings.filter(
            (booking) => booking._id !== bookingId
        );
        this.setState({ bookings: updatedBookings, isLoading: false });
    };
    render() {
        return (
            <React.Fragment>
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                    <BookingList
                        bookings={this.state.bookings}
                        onDelete={this.deleteBookingHandler}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default BookingsPage;
