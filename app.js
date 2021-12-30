const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphQL/schema/index");
const graphqlResolvers = require("./graphQL/resolvers/index");
const isAuth = require("./middleware/isAuth");
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
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

app.listen(PORT, (req, res) => {
    console.log("Server running on PORT 3000");
});
