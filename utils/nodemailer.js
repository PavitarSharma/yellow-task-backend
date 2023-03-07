import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 465,
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: "New contact form submission",
    html: `
        <p>Username: ${options.username}</p>
        <p>Email: ${options.email}</p>
        <p>Phone: ${options.phone}</p>
        <p>Message: ${options.message}</p>
      `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
