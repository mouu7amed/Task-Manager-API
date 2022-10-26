const sgMail = require("@sendgrid/mail");
const sgAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sgAPIKey);

const sendWelcomeEmail = (email, name) => {
  const msg = {
    from: "mouu7amed@gmail.com",
    to: email,
    subject: "Thanks for joining in!",
    text: `Welcome to the app ${name}. Let me know how you get along with the app.`,
  };

  sgMail
    .send(msg)
    .catch((error) => console.log("Error sending your email!, ", error));
};

const sendCancelEmail = (email, name) => {
  const msg = {
    from: "mouu7amed@gmail.com",
    to: email,
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  };

  sgMail
    .send(msg)
    .catch((error) => console.log("Error sending your email!, ", error));
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
