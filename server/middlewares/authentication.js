// server/middlewares/authentication.js
const { User } = require('../models');
const { jwtCompare } = require('../utils/utils');

const authenticate = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        // Case 1: No Authorization header provided
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new Error("TOKEN_REQUIRED");
        }

        const token = authorization.split(' ')[1];

        // Case 2: Use your helper to verify the token
        const decoded = jwtCompare(token);

        const user = await User.findByPk(decoded.id);

        // Case 3: User ID from token does not exist in the database
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        // If all checks pass, attach user to the request and continue
        req.user = user;
        next();
    } catch (error) {
        // Pass ANY error (our custom ones, or JWT errors like 'TokenExpiredError') to the centralized handler
        next(error);
    }
};

module.exports = authenticate;