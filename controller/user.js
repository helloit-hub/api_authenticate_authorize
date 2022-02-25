const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoUserModel = require("../model/user");
require("dotenv").config();

// User Object
class User {
  constructor(username, email, newPassword, phoneNumber, token) {
    this.username = username;
    this.email = email;
    this.password = newPassword;
    this.phoneNumber = phoneNumber;
    this.token = token;
  }
}

// Register route controller
const registerUser = async (req, res) => {
  const { username, email, newPassword, confirmPassword, phoneNumber } =
    req.body;

  //  Checking if all information filledup

  if (!username || !email || !phoneNumber || !newPassword) {
    res.status(400).json({ message: "Please Enter All Informations" });
    throw new Error("Please Enter All Informations");
  }

  // Checking if email already exist
  const checkduplicateEmail = await mongoUserModel.findOne({ email: email });
  if (checkduplicateEmail) {
    res.json({ message: "User Already Exist" });
    throw new Error("User already Exist");
  }

  // checking for matching passwords
  if (newPassword !== confirmPassword) {
    res.status(400).json({ message: "Password not match" });
    throw new Error("Password not match");
  }

  // Password Hashing
  const passwordSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, passwordSalt);

  // Creating user object
  const user = new User(
    username,
    email,
    hashedPassword,
    phoneNumber,
    generateToken(email)
  );

  // inserting to database
  mongoUserModel.create(user);

  // response back to client
  res.json({ message: "Successfully Registered" });
};

// login route controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Finding Email to database
  const user = await mongoUserModel.findOne({ email: email });

  // if email exist or not
  if (user == null) {
    res.status(401).json({
      message: "Does not have any account associated with this email",
    });
    throw new Error("Does not have any account associated with this email");
  }

  // matching password
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (isCorrectPassword) {
    res.setHeader("Authorization", `Bearer ${user.token}`);
    res.json({ message: "Login Successful" });
  } else {
    res.status(401).json({ message: "Wrong credentials" });
  }
};

// profile routes controller
const userProfile = (req, res) => {
  if (req.user) {
    res.json({
      username: req.user.username,
      phoneNumber: req.user.phoneNumber,
    });
  }
};

// Return Generated Token
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerUser, loginUser, userProfile };
