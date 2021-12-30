import React from "react";

import "./EventItem.css";

const EventItem = (props) => {
    const { event, authUser, showDetails } = props;
    return (
        <li key={event._id} className="event-list-item">
            <div className="">
                <h1> {event.title}</h1>
                <h2>$ {event.price} </h2>
            </div>
            <div className="">
                {authUser === event.creator._id ? (
                    <p>You are the owner of this event.</p>
                ) : (
                    <button
                        className="btn"
                        onClick={showDetails.bind(this, event._id)}
                    >
                        View Details
                    </button>
                )}
            </div>
        </li>
    );
};

export default EventItem;
