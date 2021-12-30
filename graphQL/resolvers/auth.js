const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
    createUser: async (args) => {
        try {
            const { email, password } = args.userInput;
            const foundUser = await User.findOne({
                email,
            });
            if (foundUser) {
                throw new Error("User already Exists.");
            }
            const user = new User({
                email,
                password: await bcrypt.hash(password, 3),
            });
            // return password: null for safty purpose.
            return user.save();
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) throw Error("User not Find.");
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) throw Error("Password is wrong.");
            const token = jwt.sign(
                { userId: user.id, email: email },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            return {
                userId: user.id,
                token,
                tokenExpiration: 1,
            };
        } catch (err) {
            throw err;
        }
    },
};
