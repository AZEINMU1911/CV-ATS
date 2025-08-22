const { User } = require("../models")
const { jwtCreate, comparePwd } = require("../utils/utils")
const { Op } = require("sequelize")

class UserController {
    static async register(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body || {}
            await User.create({ firstName, lastName, email, password })
            res.status(201).json({ "message": "User has been created" })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || !password) throw new Error("NO_INPUT")
            const foundUser = await User.findOne({
                where: {
                    email
                }
            })
            if (!foundUser) throw new Error("INVALID_CREDENTIALS")

            const isMatch = comparePwd(password, foundUser.password)
            if (!isMatch) throw new Error("INVALID_CREDENTIALS")

            const payload = {
                "id": foundUser.id,
                "email": foundUser.email
            }

            const token = jwtCreate(payload)

            res.status(200).json({
                "message": "Success login",
                "access_token": token
            })

        } catch (error) {
            next(error)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const { OAuth2Client } = require("google-auth-library");
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const { token } = req.body;

            if (!token) {
                throw new Error("GOOGLE_TOKEN_REQUIRED");
            }

            // Verify the Google token
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { sub: googleId, email, given_name: firstName, family_name: lastName, name } = payload;

            // Check if user already exists by email or googleId
            let user = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email },
                        { googleId: googleId }
                    ]
                }
            });

            if (!user) {
                const nameParts = name ? name.split(' ') : [];
                const finalFirstName = firstName || nameParts[0] || 'Google';
                const finalLastName = lastName || nameParts.slice(1).join(' ') || 'User';

                user = await User.create({
                    firstName: finalFirstName,
                    lastName: finalLastName,
                    email: email,
                    googleId: googleId,
                    password: null, // No password needed for Google users
                    isEmailVerified: true // Google emails are already verified
                });
            } else if (!user.googleId) {
                // User exists but doesn't have Google linked - link the Google account
                user.googleId = googleId;
                user.isEmailVerified = true; // Mark as verified since Google confirms email
                await user.save();
            }

            // Create JWT payload
            const jwtPayload = {
                id: user.id,
                email: user.email
            };

            const access_token = jwtCreate(jwtPayload);

            res.status(200).json({
                message: "Google login successful",
                access_token: access_token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            })
        } catch (error) {
            console.error("Google Login Error:", error);
            next(error);
        }
    }
}

module.exports = { UserController }