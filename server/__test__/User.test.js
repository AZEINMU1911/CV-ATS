const app = require("../app")
const request = require("supertest")
const { sequelize, User } = require("../models/index")
const { hashPwd } = require("../utils/utils")
const queryInterface = sequelize.getQueryInterface()


beforeAll(async () => {
    const user = {
        "firstName": "TestUser",
        "lastName": "TesTUser",
        "password": hashPwd("TestUser"),
        "email": "testUser@mail.com",
        "createdAt": new Date(),
        "updatedAt": new Date()
    }

    await queryInterface.bulkInsert("Users", [user], {})
})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
})

describe("POST - REGISTER USER /register", () => {

    test("/register - SUCCESS", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "lastName": "User",
                "password": "123456",
                "email": "test@mail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("message", "User has been created")
    })

    test("/register - FAIL : NO EMAIL", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "lastName": "User",
                "password": "123456"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Email cannot be empty.")
    })

    test("/register - FAIL : INVALID EMAIL FORMAT", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "lastName": "User",
                "password": "123456",
                "email": "testmail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Please provide a valid email address.")
    })

    test("/register - FAIL : NO PASSWORD", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "lastName": "User",
                "email": "testmail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Password is required")
    })

    test("/register - FAIL : PASSWORD LESS THAN.6 CHARACTER", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "lastName": "User",
                "password": "123",
                "email": "test@mail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Password must be atleast 6 characters")
    })

    test("/register - FAIL: NO FIRST NAME", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "lastName": "User",
                "password": "123456",
                "email": "test@mail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "First name cannot be empty")
    })

    test("/register - FAIL: NO LAST NAME", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "password": "123456",
                "email": "test@mail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Last name cannot be empty")
    })

    test("/register - FAIL: DUPLICATE EMAIL", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                "firstName": "Test",
                "lastName": "User",
                "password": "123456",
                "email": "test@mail.com"
            })
        // console.log(response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "An account with this email already exists.")
    })
})

describe("POST - LOGIN USER /login", () => {
    test("/login SUCCESS", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                "email": "testUser@mail.com",
                "password": "TestUser"
            })
        // console.log(response.body.access_token);
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message", "Success login")
        expect(response.body).toHaveProperty("access_token")
        expect(response.body.access_token).toBeTruthy()
    })

    test("/login FAIL : WRONG EMAIL", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                "email": "WRONGUser@mail.com",
                "password": "TestUser"
            })
        // console.log(response.body.access_token);
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "Incorrect Email/Password")
    })

    test("/login FAIL : WRONG PASSWORD", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                "email": "testUser@mail.com",
                "password": "WRONGPASSWORD"
            })
        // console.log(response.body.access_token);
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "Incorrect Email/Password")
    })

    test("/login FAIL : NO INPUT", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                
            })
        // console.log(response.body.access_token);
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "Check Input")
    })
})
