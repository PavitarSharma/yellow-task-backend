import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "username is required"],
  },

  email: {
    type: String,
    trim: true,
    required: [true, "email is required"],
  },

  phone: {
    type: String,
    trim: true,
    required: [true, "phone is required"],
  },

  message: {
    type: String,
    trim: true,
    required: [true, "message is required"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
