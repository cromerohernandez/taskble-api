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
      <p style="text-align:center"><img id="logo" src="../public/images/taskbleLogo.png"</p>
      <h2 style="text-align:center">Welcome ${targetUser.username}!</h2>
      <h4 style="text-align:center"><a href='${APP_HOST}/users/${targetUser.validationToken}/validate' style="text-decoration:none">Confirm</a> your account and start to manage your tasks with <span style="color:moccasin">Taskble</span>!</h4>
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
      <p style="text-align:center"><img id="logo" src="../public/images/taskbleLogo.png"</p>
      <h2 style="text-align:center">${targetUser.username}, we have received a request to change the password for your account at <span style="color:moccasin">Taskble</span></h2>
      <h4 style="text-align:center">If it was you, <a href='${CORS_ORIGIN}/newpassword/${targetUser.validationToken}' style="text-decoration:none">continue</a> with the process.</h4>
      <h4 style="text-align:center">If you haven't made the request, someone is trying to change your password. We recommend that you access <a href='${CORS_ORIGIN}/' style="text-decoration:none">Taskble</a> now and proceed to change your password.</h4>
    `
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}