const nodemailer = require('nodemailer')

const APP_HOST = process.env.APP_HOST || 'http://localhost:5000'

const user = process.env.MAILER_TASKBLE_USER
const pass = process.env.MAILER_TASKBLE_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
})

module.exports.sendValidateUserEmail = (targetUser) => {
  transporter.sendMail({
    from: `Taskble <${user}>`,
    to: targetUser.email,
    subject: 'Welcome to Taskble!',
    html: `
      <h1>Welcome ${targetUser.email}</h1>
      <p><a href='${APP_HOST}/users/${targetUser.validationToken}/validate'>Confirm</a> your account and start to manage your tasks with Taskble!</p>
    `
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}