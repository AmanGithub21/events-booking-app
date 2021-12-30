import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Events.css";
import authContext from "../components/context/auth-context";
import EventList from "../components/Events/EventList";
import Spinner from "../components/Spinner/Spinner";

class EventsPage extends Component {
    static contextType = authContext;
    constructor(props) {
        super(props);
        this.state = {
            creating: false,
            events: [],
            isLoading: false,
            selectedEvent: null,
        };
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }
    isActive = true;
    componentDidMount() {
        this.fetchEvents();
    }
    componentWillUnmount() {
        this.isActive = false;
    }
    startCreateEventHandler = () => {
        this.setState({ creating: true });
    };
    modalConfirmHandler = async () => {
        this.setState({ creating: false });
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;
        if (
            title.trim().length === 0 ||
            price < 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return console.log("Error in modalConfirmHandler.");
        }
        const requestBody = {
            query: `
                mutation {
                    createEvents(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                        }
                    }
                }
            `,
        };
        const token = this.context.token;
        const res = await fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });
        if (res) {
            if (res.status !== 200 && res.status !== 201)
                throw new Error("Failed in modalConfirmHandler 2!");
            const resData = await res.json();
            const updatedEvents = this.state.events;
            updatedEvents.push(resData.data.createEvents);
            this.setState({ events: updatedEvents });
        }
    };
    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    };

    fetchEvents = async () => {
        this.setState({ isLoading: true });
        setTimeout(async () => {
            const requestBody = {
                query: `
                    query {
                        events {
                            _id
                            title
                            description
                            price
                            date
                            creator {
                                _id
                            }
                        }
                    }
                `,
            };
            const res = await fetch("http://localhost:8000/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res) {
                if (res.status !== 200 && res.status !== 201)
                    throw new Error("Failed!");
                const resData = await res.json();
                if (this.isActive) {
                    this.setState({
                        events: resData.data.events,
                        isLoading: false,
                    });
                }
            }
        }, 500);
    };
    showDetailsHandler = (eventId) => {
        const selectedEvent = this.state.events.find(
            (event) => eventId === event._id
        );
        this.setState({ selectedEvent: selectedEvent });
    };
    bookEventHandler = async () => {
        const requestBody = {
            query: `
            mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}") {
                    _id
                    createdAt
                    updatedAt
                }
            }
            `,
        };
        const res = await fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.context.token,
            },
        });
        if (res) {
            if (res.status !== 200 && res.status !== 201) {
                this.setState({
                    selectedEvent: null,
                });
                throw new Error("Failed!");
            }
            this.setState({
                selectedEvent: null,
            });
        }
    };

    render() {
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && (
                    <Backdrop />
                )}
                {this.state.creating && (
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        submitText="Confirm"
                    >
                        <form action="">
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    defaultValue={"Aman"}
                                    ref={this.titleEl}
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    defaultValue={44.4}
                                    ref={this.priceEl}
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    defaultValue={new Date().toDateString()}
                                    ref={this.dateEl}
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    type="text"
                                    id="description"
                                    rows={4}
                                    ref={this.descriptionEl}
                                >
                                    This is the default description.
                                </textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.selectedEvent && (
                    <Modal
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm={this.context.token ? true : false}
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}
                        submitText="Book"
                    >
                        <h1> {this.state.selectedEvent.title} </h1>
                        <h4>
                            $ {this.state.selectedEvent.price} -{" "}
                            {new Date(
                                this.state.selectedEvent.date
                            ).toDateString()}
                        </h4>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                )}
                {this.context.token ? (
                    <div className="events-control">
                        <p>Share your own Events</p>
                        <button
                            className="btn btn-outline"
                            onClick={this.startCreateEventHandler}
                        >
                            Create Events
                        </button>
                    </div>
                ) : (
                    <h2
                        style={{
                            "display": "flex",
                            "justifyContent": "center",
                        }}
                    >
                        <strong>
                            To create event, Authenticate your self.
                        </strong>
                    </h2>
                )}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                    <EventList
                        events={this.state.events}
                        authUser={this.context.userId}
                        showDetails={this.showDetailsHandler}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default EventsPage;
