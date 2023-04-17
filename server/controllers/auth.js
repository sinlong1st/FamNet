import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Register New User */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    //Generate a salt
    const salt = await bcrypt.genSalt();

    //Hash the password with the salt
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); //201 = Created!
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
