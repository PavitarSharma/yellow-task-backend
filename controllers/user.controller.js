import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";

class UserController {
  async getUser(req, res, next) {
    const { id } = req.params;

    const user = await User.findById({ _id: id });

    if (!user) {
      return next(new ErrorHandler("User not found with this id", 404));
    }

    res.status(200).json({ user });
  }

  async getAllUsers(req, res, next) {
    const users = await User.find({});

    if (!users) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ users });
  }

  async deleteUser(req, res, next) {
    const { id } = req.params;

    const user = await User.findByIdAndDelete({ _id: id });

    if (!user) {
      return next(new ErrorHandler("User not found with this id", 404));
    }

    res.status(200).json("User deleted");
  }
}

const userController = new UserController();

export default userController;
