const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  }
});
const url = process.env.URL;

const getPasswordResetURL = (user, token) =>
  `${url}pages/newpassword.html?user=${user._id}&token=${token}`

const resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN
  const to = user.email
  const subject = "🌎 Відновити пароль 🌎"
  const html = `
  <p>Привіт, ${user.nickname},</p>
  <br>
  <p>Ми дізналися, що ви втратили свій пароль від сервису.</p>
  <p>Все добре. Щоб відновити пароль, скористайтеся цим посиланням:</p>
  <br>
  <a href=${url}>новий пароль</a>
  <p>Посилання дійсне протягом 72 годин.</p>
  <br>
  <p> Ваші друзі з сервису</p>
  `
  return { from, to, subject, html }
};

const newUserTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN
  const to = user.email
  const subject = "🌎 Підтвердіть адресу електронної пошти 🌎"
  const html = `
  <p>Привіт, ${user.nickname},</p>
  <br>
  <p>Вітаю вас на нашому проекті!</p>
  <p>Будь ласка, підтвердіть адресу своєї електронної пошти використовуючи це посилання:</p>
  <br>
  <a href=${url}>підтвердіть адрес</a>
  <p>Посилання дійсне протягом 72 годин.</p>
  <br>
  <p> Ваші друзі з сервису</p>
  `
  return { from, to, subject, html }
};

module.exports = { transporter, getPasswordResetURL, resetPasswordTemplate, newUserTemplate };