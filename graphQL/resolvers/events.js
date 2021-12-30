const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("../../helpers/transform");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            const transformedEvents = events.map((event) => {
                return transformEvent(event);
            });
            return transformedEvents;
        } catch (err) {
            throw err;
        }
    },
    createEvents: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated");
        }
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: req.userId,
        });
        const res = await event.save();
        let createdEvent = transformEvent(res);
        const user = await User.findById(req.userId);
        if (user) user.createdEvents.push(res);
        else throw new Error("Creator Not Found.");
        await user.save();
        return createdEvent;
    },
};
