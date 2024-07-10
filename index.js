const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://madhurkjindal:tX0nCfXAPo5JEiGv@cluster0.wmo8dlz.mongodb.net//usersDB");
    console.log("Database Connected");
  } catch (error) {
    console.log("error in db connection");
    console.log(error);
  }

  // create account on mongodb atlas
};

//mongoose.connect('mongodb://localhost:27017/usersDB');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phoneNumber: String,
});
const User = mongoose.model('User', userSchema);

app.post("/register", async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, phoneNumber });
  await newUser.save();
  res.status(201).send({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(200).send({ token });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

app.listen(5000, () => {
  dbConnect()
  console.log("Server is running on port 5000");
});
