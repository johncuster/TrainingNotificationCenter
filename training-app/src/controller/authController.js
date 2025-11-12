const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "yoursecretkey";

const authController = {
    
  loginUser: (req, res) => {
    console.log("HEY LOGGING IN");
    const { user_ln } = req.body;

    const sql = "SELECT * FROM user_member WHERE user_ln = ?";
    db.query(sql, [user_ln], async (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }

      const user = result[0];
      try {
        //     // compare password
        //     const validPass = await bcrypt.compare(password, user.user_password);
        //     if (!validPass) {
        //       return res.status(401).json({ error: "Invalid password" });
        //     }

         // generate token
         const token = jwt.sign(
           { id: user.user_id, role: user.user_role },
           SECRET_KEY,
            { expiresIn: "2h" }
         );

         console.log(`✅ User ${user.user_role} logged in successfully.`);

         res.json({
           message: "Login successful",
           token,
           user_role: user.user_role,
           user_id: user.user_id,
         });
       } catch (compareErr) {
         console.error("Password comparison error:", compareErr);
         res.status(500).json({ error: "Server error during login" });
       }

    //   try {
    //     // compare password
    //     const validPass = await bcrypt.compare(password, user.user_password);
    //     if (!validPass) {
    //       return res.status(401).json({ error: "Invalid password" });
    //     }

    //     // generate token
    //     const token = jwt.sign(
    //       { id: user.user_id, role: user.user_role },
    //       SECRET_KEY,
    //       { expiresIn: "2h" }
    //     );

    //     console.log(`✅ User ${user.user_email} logged in successfully.`);

    //     res.json({
    //       message: "Login successful",
    //       token,
    //       role: user.user_role,
    //       id: user.user_id,
    //     });
    //   } catch (compareErr) {
    //     console.error("Password comparison error:", compareErr);
    //     res.status(500).json({ error: "Server error during login" });
    //   }
    });
  },
};

module.exports = authController;
