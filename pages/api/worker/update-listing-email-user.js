import nodemailer from 'nodemailer'
import mailGun from 'nodemailer-mailgun-transport'
import validator from 'validator'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_API_DOMAIN,
  },
}

const transporter = nodemailer.createTransport(mailGun(auth))

const mailTo = (user, callback) => {
  //validation
  const output = `
  <h3>Updated User!</h3> 
  A listing from your account was just updated. If you did not request this, please contact Eagle Force Support. support@eagleforceemploymentservices.com
          `
  const mailOptions = {
    from: 'noreply@eagleforceemploymentservices.com',
    to: user,
    subject: 'Updated User Listings',
    html: output,
  }
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      callback('Internal Error', undefined)
    } else {
      callback(undefined, data)
    }
  })
}

export default function mail(req, res) {
  const { user } = req.body
  mailTo(user, (err, data) => {
    res.send({
      user,
      formResponse: err,
    })
  })
}
