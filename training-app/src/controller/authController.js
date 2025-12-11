const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const SECRET_KEY = crypto.randomBytes(64).toString("hex");

const authController = {

 loginUser: async (req, res) => {
  console.log("HEY LOGGING IN");

  const { user_email, user_password } = req.body;

  // ✅ Validate input
  if (!user_email || !user_password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM user_member WHERE user_email = ?";

  db.query(sql, [user_email], async (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      console.log("User not found:", user_email);
      return res.status(401).json({ error: "Invalid username or password" }); // Generic error
    }

    const user = result[0];

    try {
      console.log("Comparing password for user:", user_email);

      const validPass = await bcrypt.compare(user_password, user.user_password);
      console.log("Password valid?", validPass);
      if (!validPass) {
        console.log("Invalid password attempt for user:", user_email);
        return res.status(401).json({ error: "Invalid username or password" }); // Generic error
      }

      const token = jwt.sign(
        { id: user.user_id, role: user.user_role },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      console.log(`User ${user_email} logged in successfully as ${user.user_role}`);

      // ✅ Return user info and token
      return res.json({
        message: "Login successful",
        token,
        user_ln: user.user_ln,
        user_fn: user.user_fn,
        user_role: user.user_role,
        user_email: user.user_email,
        user_id: user.user_id,
      });

    } catch (compareErr) {
      console.error("Password comparison error:", compareErr);
      return res.status(500).json({ error: "Server error during login" });
    }
  });
},


};

module.exports = authController;
