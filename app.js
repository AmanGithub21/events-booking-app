require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("./graphQL/schema/index");
const graphqlResolvers = require("./graphQL/resolvers/index");
const isAuth = require("./middleware/isAuth");
const port = process.env.PORT;

const dbUrl = process.env.MONGODBURL;
console.log(dbUrl);
mongoose
    .connect(`${dbUrl}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected."))
    .catch((err) => console.log("DB not connected.", err));

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    if (req.method == "OPTIONS") return res.sendStatus(200);
    next();
});
app.use(isAuth);
app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
    })
);
app.use(express.static("frontend/build"));

app.get("/", (req, res) => {
    res.write("<h1>Aman Porwal</h1>");
});

app.listen(port, (req, res) => {
    console.log("Server running on PORT 3000");
});
