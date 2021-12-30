const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const authHead = req.get("Authorization");
        if (!authHead) {
            req.isAuth = false;
            return next();
        }
        const token = authHead.split(" ")[1];
        if (!token || token === "") {
            req.isAuth = false;
            return next();
        }
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken) {
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.log(error);
        req.isAuth = false;
        return next();
    }
};
