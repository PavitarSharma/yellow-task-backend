import Contact from "../models/contact.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendMail from "../utils/nodemailer.js";

class ContactController {
  async createContact(req, res, next) {
    try {
      const { username, email, phone, message } = req.body;

      if (!username || !email || !phone || !message) {
        return next(new ErrorHandler("All fileds is required", 400));
      }

      const contact = new Contact({ username, email, phone, message });

      await contact.save();
      await sendMail({ username, email, phone, message });

      res.status(201).json({ contact });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getSingleContact(req, res, next) {
    try {
      const { id } = req.params;

      const contact = await Contact.findOne({ _id: id });

      if (!contact) {
        return next(new ErrorHandler("Contact not found with this id", 404));
      }

      res.status(200).json({ contact });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllContact(req, res, next) {
    const contacts = await Contact.find();

    if (!contacts) {
      return next(new ErrorHandler("Contact not found", 404));
    }

    res.status(200).json({ contacts });
  }

  async updateContact(req, res, next) {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return next(new ErrorHandler("Contact not found with this id", 404));
    }

    res.status(201).json({ contact });
  }

  async deleteContact(req, res, next) {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete({ _id: id });

    if (!contact) {
      return next(new ErrorHandler("Contact not found with this id", 404));
    }

    res.status(200).json(`Contact delted with thsi id ${contact._id}`);
  }
}

const contactController = new ContactController();

export default contactController;
