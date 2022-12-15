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

const mailTo = (callback) => {
  //validation
  const output = `
                <h3>New User!</h3> 
                Congratulations, someone posted a new listing! Go check out their listing here eagleforceemploymentservices.com/profile
            `
  const mailOptions = {
    from: 'noreply@eagleforceemploymentservices.com',
    to: 'harold@eagleforceemploymentservices.com',
    subject: 'New Eagle Force Listing',
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
  mailTo((err, data) => {
    res.send({
      formResponse: err,
    })
  })
}
