const mailer = require("nodemailer");

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  const transport = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "devsoftwares85@gmail.com",
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transport.sendMail({
    from: email,
    to: "devsoftwares85@gmail.com",
    subject: `${name}'s message`,
    html: `
            <b>From</b>
            <br>
            ---------------
            <br>
            <b>Name</b>: ${name}
            <br>
            <b>Email</b>: ${email}
            <br>
            <b>Message</b>: ${message}
        `,
  });

  res.status(200).json({ success: true, msg: "successfully" });
};

module.exports = contact;
