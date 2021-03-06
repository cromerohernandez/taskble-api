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
    attachments: [{
      filename: 'taskbleLogo.png',
      path: './public/images/taskbleLogo.png',
      cid: 'taskbleLogo' 
    }],
    html: `
      <p style="text-align:center"><img id="logo" src="cid:taskbleLogo" width="250em"/></p>
      <h2 style="text-align:center">Welcome ${targetUser.username}!</h2>
      <h2 style="text-align:center; color:rgb(80,80,80); font-weight:normal"><a href='${APP_HOST}/users/${targetUser.validationToken}/validate' style="text-decoration:none">Confirm</a> your account and start to manage your tasks with Taskble!</h2>
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
    attachments: [{
      filename: 'taskbleLogo.png',
      path: './public/images/taskbleLogo.png',
      cid: 'taskbleLogo' 
    }],
    html: `
      <p style="text-align:center"><img id="logo" src="cid:taskbleLogo" width="250em"/></p>
      <h2 style="text-align:center; font-weight:bold">${targetUser.username}, we have received a request to change the password for your account at taskble.</h2>
      <h2 style="text-align:center; color:rgb(80,80,80); font-weight:normal">If it was you, <a href='${CORS_ORIGIN}/${targetUser.validationToken}/newpassword' style="text-decoration:none">continue</a> with the process.</h2>
      <h2 style="text-align:center; color:rgb(80,80,80); font-weight:normal">If you haven't made the request, someone is trying to change your password. We recommend that you access <a href='${CORS_ORIGIN}/' style="text-decoration:none">taskble</a> now and proceed to change your password.</h2>
    `
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}