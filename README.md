# CVATS API Documentation

**Authentication:** `🔒 Protected` endpoints require an `Authorization: Bearer <TOKEN>` header.

## Authentication

### Register New User

- **Endpoint:** `POST /register`
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response (201):**
  ```json
  { "message": "User registered successfully. Please log in." }
  ```
- **Error Responses:**
  - `400`: `{"message": "Validation error from model (e.g., First name cannot be empty)"}`
  - `400`: `{"message": "An account with this email already exists."}` (from `SequelizeUniqueConstraintError`)

### Login User

- **Endpoint:** `POST /login`
- **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Success login",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses:**
  - `401`: `{"message": "Check Input"}`
  - `401`: `{"message": "Incorrect Email/Password"}`

### Google Login

- **Endpoint:** `POST /google-login`
- **Request Body:**
  ```json
  { "token": "<GOOGLE_ID_TOKEN>" }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Google login successful",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "email": "user@google.com", ... }
  }
  ```
- **Error Responses:** `401` if the Google token is invalid.

## CV Management

### Get All User CVs

- **Endpoint:** `GET /cvs` `🔒 Protected`
- **Request Body:** None
- **Success Response (200):**
  ```json
  [ { "id": 1, "originalName": "MyResume.pdf", ... } ]
  ```
- **Error Responses:**
  - `401`: `{"message": "Authentication failed. Please log in."}`
  - `401`: `{"message": "Invalid token."}`

### Upload a CV

- **Endpoint:** `POST /cvs/upload` `🔒 Protected`
- **Request Body:** `multipart/form-data` with key `cv` and a PDF file value.
- **Success Response (201):**
  ```json
  {
    "message": "CV uploaded successfully.",
    "cv": { "id": 2, "originalName": "Updated_CV.pdf", ... }
  }
  ```
- **Error Responses:**
  - `400`: `{"message": "No file was uploaded. Please select a file to upload."}`
  - `400`: `{"message": "Invalid file type. Only PDF files are allowed."}`
  - `400`: `{"message": "File is too large. Maximum size is 5MB."}`

### Delete a CV

- **Endpoint:** `DELETE /cvs/:cvId` `🔒 Protected`
- **Request Body:** None
- **Success Response (200):**
  ```json
  { "message": "CV deleted successfully." }
  ```
- **Error Responses:**
  - `404`: `{"message": "CV not found"}`

## AI Analysis

### Run a New Analysis

- **Endpoint:** `POST /analysis/:cvId` `🔒 Protected`
- **Request Body (Optional):**
  ```json
  { "temperature": 0.5 }
  ```
- **Success Response (200):**
  ```json
  {
    "atsScore": 85,
    "feedback": { ... },
    "keywords": { ... }
  }
  ```
- **Error Responses:**
  - `404`: `{"message": "CV not found"}`
  - `500`: `{"message": "Internal Server Error"}` (if AI fails)

### Get Latest Analysis Report

- **Endpoint:** `GET /analysis/:cvId` `🔒 Protected`
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "id": 1,
    "score": 85,
    "feedback": { ... },
    "suggestions": { ... },
    ...
  }
  ```
- **Error Responses:**
  - `404`: `{"message": "CV not found"}`
