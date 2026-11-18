const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// API 1 – User Registration
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = ?;`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser !== undefined) {
    // Scenario 1: Username already exists
    response.status(400);
    response.send("User already exists");
  } else if (password.length < 5) {
    // Scenario 2: Password is too short
    response.status(400);
    response.send("Password is too short");
  } else {
    // Scenario 3: Successful registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `
      INSERT INTO
        user (username, name, password, gender, location)
      VALUES
        (?, ?, ?, ?, ?);`;
    await db.run(createUserQuery, [
      username,
      name,
      hashedPassword,
      gender,
      location,
    ]);
    response.status(200);
    response.send("User created successfully");
  }
});

// API 2 – User Login
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = ?;`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    // Scenario 1: Invalid user
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      // Scenario 3: Successful login
      response.status(200);
      response.send("Login success!");
    } else {
      // Scenario 2: Invalid password
      response.status(400);
      response.send("Invalid password");
    }
  }
});

// API 3 – Change Password
app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = ?;`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    // If the user does not exist
    response.status(400);
    response.send("Invalid current password");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      dbUser.password
    );

    if (isPasswordMatched !== true) {
      // Scenario 1: Invalid current password
      response.status(400);
      response.send("Invalid current password");
    } else if (newPassword.length < 5) {
      // Scenario 2: Password is too short
      response.status(400);
      response.send("Password is too short");
    } else {
      // Scenario 3: Successful password update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatePasswordQuery = `
        UPDATE
          user
        SET
          password = ?
        WHERE
          username = ?;`;
      await db.run(updatePasswordQuery, [hashedPassword, username]);
      response.status(200);
      response.send("Password updated");
    }
  }
});

module.exports = app;
