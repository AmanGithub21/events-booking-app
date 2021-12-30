const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("../../helpers/transform");

module.exports = {
    bookings: async (args, req) => {
        const bookings = await Booking.find({ user: req.userId });
        return bookings.map((booking) => {
            return transformBooking(booking);
        });
    },
    bookEvent: async (args, req) => {
        const booking = new Booking({
            user: req.userId,
            event: await Event.findById(args.eventId),
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args) => {
        const booking = await Booking.findByIdAndDelete(
            args.bookingId
        ).populate("event");
        return transformEvent(booking.event);
    },
};
