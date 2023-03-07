import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport"

class AuthController {
  async createUser(req, res, next) {
    const { username, password } = req.body;

    if (username === "" || password === "") {
      return next(new ErrorHandler("Username and password is required", 400));
    }
    let user = await User.findOne({ username }).exec();
    if (user) {
      return next(new ErrorHandler("Username is already exits", 400));
    }
    user = await User.create({ username, password });

    res.status(201).json({ user });
  }

  async loginUser(req, res, next) {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      return next(new ErrorHandler("Username and password is required", 400));
    }
    const user = await User.findOne({ username });
    if (!user) return next(new ErrorHandler("Invalid username or password", 400));

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid username or password", 400));
    }

    const token = await generateToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    const userInfo = {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }

    res.status(200).json({
      message: "Logged in successfully",
      user: userInfo,
      token,
    });
  }

  async facebookCallback(req, res) {
    const user = await User.findById({_id: req.user._id});
    const token = await generateToken(req.user);
    console.log(token);
  
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    console.log("token",token);
    res.status(200).json({token})
  }

  async googleCallback(req, res) {

    const user = await User.findById({_id: req.user._id});
    const token = await generateToken(req.user);
    console.log(token);
  
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    console.log("token",token);
    res.status(200).json({token})
  }
}

const authController = new AuthController();

export default authController;
