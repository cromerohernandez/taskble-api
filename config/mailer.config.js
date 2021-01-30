const nodemailer = require('nodemailer')

const APP_HOST = process.env.APP_HOST || 'http://localhost:5000'
const CORS_ORIGIN= process.envCORS_ORIGIN || 'http://localhost:3000'

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
      <h2>Welcome ${targetUser.username}</h2>
      <p><a href='${APP_HOST}/users/${targetUser.validationToken}/validate'>Confirm</a> your account and start to manage your tasks with Taskble!</p>
    `
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}

module.exports.sendUpdatePasswordEmail = (targetUser) => {
  transporter.sendMail({
    from: `Taskble <${user}>`,
    to: targetUser.email,
    subject: 'Taskble password change request',
    html: `
      <h2>${targetUser.username}, we have received a request to change the password for your account at Taskble.</h2>
      <p>If it was you, <a href='${CORS_ORIGIN}/newpassword/${targetUser.validationToken}'>continue</a> with the process.</p>
      <p>If you haven't made the request, someone is trying to change your password. We recommend that you access <a href='${CORS_ORIGIN}/'>Taskble</a> now and proceed to change your password.</p>
    `
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}