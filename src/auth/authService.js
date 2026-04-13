const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
   console.log(req.body)
  try {
    const db = req.app.locals.db;
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and passwords are obligatory",
      });
    }

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name: name || "",
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Created user",
      userId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email i hasło są wymagane",
      });
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Nieprawidłowy email lub hasło",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Nieprawidłowy email lub hasło",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Logowanie poprawne",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
};