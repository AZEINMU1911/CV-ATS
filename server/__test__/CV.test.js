const request = require('supertest');
const app = require('../app');
const { sequelize, User, CV } = require('../models');
const { jwtCreate, hashPwd } = require('../utils/utils');
const path = require('path');
const cloudinary = require('../config/cloudinaryConfig');

jest.mock('../config/cloudinaryConfig', () => ({
    uploader: {
        upload_stream: jest.fn(),
        // Add a mock for the destroy function
        destroy: jest.fn((public_id, options, callback) => {
            // Simulate a successful deletion by calling the callback
            if (callback) {
                callback(null, { result: 'ok' });
            }
            // Also, return a promise that resolves for async usage
            return Promise.resolve({ result: 'ok' });
        }),
    },
}));

let token;
let testUser;

beforeAll(async () => {
    testUser = await User.create({
        firstName: 'CV',
        lastName: 'Uploader',
        email: 'cv.uploader@test.com',
        password: 'password123'
    });
    token = jwtCreate({ id: testUser.id, email: testUser.email });
});

beforeEach(async () => {
    cloudinary.uploader.upload_stream.mockClear();
    await CV.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await sequelize.close();
});

describe('POST /cvs/upload', () => {

    it('should upload a valid PDF and return 201 for an authenticated user', async () => {
        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            callback(null, {
                public_id: 'fake_cv_id_123',
                secure_url: 'https://fake.cloudinary.com/cv.pdf',
                bytes: 123456
            });
            return { end: () => { } };
        });

        const response = await request(app)
            .post('/cvs/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('cv', path.resolve(__dirname, 'dummy.pdf'));

        expect(response.status).toBe(201);
        expect(response.body.cv).toHaveProperty('fileUrl', 'https://fake.cloudinary.com/cv.pdf');
        const cvInDb = await CV.findOne({ where: { userId: testUser.id } });
        expect(cvInDb).toBeDefined();
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
        const response = await request(app)
            .post('/cvs/upload')
            .attach('cv', path.resolve(__dirname, 'dummy.pdf'));

        expect(response.status).toBe(401);
    });

    it('should return 400 Bad Request if the file is not a PDF', async () => {
        const fs = require('fs');
        const dummyTxtPath = path.resolve(__dirname, 'dummy.txt');
        fs.writeFileSync(dummyTxtPath, 'this is not a pdf');

        const response = await request(app)
            .post('/cvs/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('cv', dummyTxtPath);

        fs.unlinkSync(dummyTxtPath);

        expect(response.status).toBe(400);
    });

    it('should return 400 Bad Request if no file is attached', async () => {
        const response = await request(app)
            .post('/cvs/upload')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it('should return 401 Unauthorized for a malformed token', async () => {
        const response = await request(app)
            .post('/cvs/upload')
            .set('Authorization', `Bearer thisisnotarealtoken`)
            .attach('cv', path.resolve(__dirname, 'dummy.pdf'));

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid token.');
    });

    it('should return 400 Bad Request if the file is too large', async () => {
        // Create a buffer that is slightly larger than 5MB
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a');
        const fs = require('fs');
        const largeFilePath = path.resolve(__dirname, 'largefile.pdf');
        fs.writeFileSync(largeFilePath, largeBuffer);

        const response = await request(app)
            .post('/cvs/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('cv', largeFilePath);

        fs.unlinkSync(largeFilePath); // Clean up the large file

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('File is too large. Maximum size is 5MB.');
    });
});

describe('GET /cvs', () => {

    it('should fetch all CVs for the authenticated user only', async () => {
        // Arrange: Create CVs for our main testUser
        await CV.bulkCreate([
            { userId: testUser.id, originalName: 'CV1.pdf', fileUrl: 'url1' },
            { userId: testUser.id, originalName: 'CV2.pdf', fileUrl: 'url2' },
        ]);

        const otherUser = await User.create({
            id: 2,
            firstName: 'Other',
            lastName: 'User',
            email: 'other@test.com',
            password: 'password123'
        });
        await CV.create({ userId: otherUser.id, originalName: 'OtherUserCV.pdf', fileUrl: 'https://www.url3.com' });

        // Act: Make the request as our main testUser
        const response = await request(app)
            .get('/cvs')
            .set('Authorization', `Bearer ${token}`);

        // Assert: Check the results
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);

        // We should only get the 2 CVs belonging to testUser
        expect(response.body).toHaveLength(2);

        // Check that the names match our user's CVs
        expect(response.body[0].originalName).toBe('CV1.pdf'); // It's ordered by most recent first
        expect(response.body[1].originalName).toBe('CV2.pdf');
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
        const response = await request(app).get('/cvs');

        expect(response.status).toBe(401);
    });

    it('should return an empty array if the user has no CVs', async () => {
        // Arrange: No CVs are created for our testUser in this test

        // Act: Make the request as our main testUser
        const response = await request(app)
            .get('/cvs')
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(0);
    });
});

describe('DELETE /cvs/:cvId', () => {

    it('should successfully delete a CV belonging to the authenticated user', async () => {
        const cv = await CV.create({
            userId: testUser.id,
            originalName: 'cv_to_delete.pdf',
            fileUrl: 'https://www.urldelete.com',
            fileName: 'public_id_to_delete'
        });

        const response = await request(app)
            .delete(`/cvs/${cv.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('CV deleted successfully.');
        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('public_id_to_delete', { resource_type: 'raw' });

        const cvInDb = await CV.findByPk(cv.id);
        expect(cvInDb).toBeNull();
    });

    it('should return 404 Not Found when trying to delete a CV belonging to another user', async () => {
        const otherUser = await User.create({
            id: 2, firstName: 'Another', lastName: 'User', email: 'another@test.com', password: 'password123'
        });
        const otherCv = await CV.create({
            userId: otherUser.id,
            originalName: 'other_user_cv.pdf',
            fileUrl: 'https://www.otherurl.com',
            fileName: 'other_public_id'
        });

        console.log("otherCV",otherCv);
        

        const response = await request(app)
            .delete(`/cvs/${otherCv.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);

        const cvInDb = await CV.findByPk(otherCv.id);
        expect(cvInDb).not.toBeNull();
    });
});