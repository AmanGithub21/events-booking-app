import React from "react";

import "./EventList.css";
import EventItem from "./EventItem";

const EventList = (props) => {
    const eventsList = props.events.map((event) => {
        return (
            <EventItem
                key={event._id}
                event={event}
                authUser={props.authUser}
                showDetails={props.showDetails}
            />
        );
    });
    return <ul className="event-list">{eventsList}</ul>;
};

export default EventList;
