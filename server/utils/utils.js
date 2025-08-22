const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const secretjwt = process.env.JWT_SECRET

const hashPwd = (plaintext) => bcrypt.hashSync(plaintext)
const comparePwd = (plaintext, password) => bcrypt.compareSync(plaintext, password)

const jwtCreate = (payload) => jwt.sign(payload, secretjwt)
const jwtCompare = (token) => jwt.verify(token, secretjwt)

module.exports = {
    hashPwd,
    comparePwd,
    jwtCreate,
    jwtCompare
}