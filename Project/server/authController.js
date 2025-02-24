const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.rows[0].id }, "SecurityKey", {
    expiresIn: "1h",
  });

  res.json({ token });
};

module.exports = { registerUser, loginUser };
