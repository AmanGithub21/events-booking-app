const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dbUrl = process.env.MONGODBURL || "mongodb://localhost/eventDB";

mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected."))
    .catch((err) => console.log("DB not connected.", err));

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Event", eventSchema);
