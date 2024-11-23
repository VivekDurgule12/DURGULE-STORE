import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";

// Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }

    // Check if user already exists
    const exitingUser = await userModel.findOne({ email });

    // If user already exists
    if (exitingUser) {
      return res.status(200).send({
        success: false,
        message: "Email already exists",
      });
    }

    // Registration logic (this was previously nested inside the if block)
    const hashedPassword = await hashPassword(password);
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    });

    // Save user to database
    await user.save(); // Ensure you await this to handle the promise

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: err.message, // Changed from `error` to `err.message`
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validate
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Incorrect password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//  forgot Password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Please enter your email" });
    }

    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }

    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findOneAndUpdate(user._id, { password: hashed });
    res
      .status(200)
      .send({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Somthing went wrong",
      error,
    });
  }
};

//test
export const testController = (req, res) => {
  res.send("Protected Route");
};
