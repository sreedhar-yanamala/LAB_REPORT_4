# User Authentication APIs

A backend application for User Authentication developed using **Node.js**, **Express.js**, **SQLite**, and **bcrypt**.

## Tech Stack
- **Node.js**
- **Express.js**
- **SQLite3** / **sqlite**
- **bcrypt** (Password hashing & verification)

## Project Structure
```text
Authentication/
│
├── app.js
├── userData.db
├── package.json
└── node_modules/
```

## Database Details
- **Database file:** `userData.db`
- **Table:** `user`
- **Columns:**
  - `username` (TEXT)
  - `name` (TEXT)
  - `password` (TEXT)
  - `gender` (TEXT)
  - `location` (TEXT)

## API Endpoints

### 1. User Registration (`POST /register`)
- **Body:**
  ```json
  {
    "username": "adam_richard",
    "name": "Adam Richard",
    "password": "richard_567",
    "gender": "male",
    "location": "Detroit"
  }
  ```
- **Responses:**
  - `400 Bad Request` &rarr; `User already exists` (if username already exists)
  - `400 Bad Request` &rarr; `Password is too short` (if password length < 5)
  - `200 OK` &rarr; `User created successfully`

### 2. User Login (`POST /login`)
- **Body:**
  ```json
  {
    "username": "adam_richard",
    "password": "richard_567"
  }
  ```
- **Responses:**
  - `400 Bad Request` &rarr; `Invalid user` (if username does not exist)
  - `400 Bad Request` &rarr; `Invalid password` (if passwords do not match)
  - `200 OK` &rarr; `Login success!`

### 3. Change Password (`PUT /change-password`)
- **Body:**
  ```json
  {
    "username": "adam_richard",
    "oldPassword": "richard_567",
    "newPassword": "richard@123"
  }
  ```
- **Responses:**
  - `400 Bad Request` &rarr; `Invalid current password` (if user does not exist or old password incorrect)
  - `400 Bad Request` &rarr; `Password is too short` (if new password length < 5)
  - `200 OK` &rarr; `Password updated`

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node app.js
   ```
   The server will run at `http://localhost:3000/`.
