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

const mailTo = (number, callback) => {
  //validation
  const output = `
    <h3>Updated User!</h3> 
    Employer ${number} just updated their listing. Check it out and approve it at eagleforcemploymentservices.com/profile/employers
            `
  const mailOptions = {
    from: 'noreply@eagleforceemploymentservices.com',
    to: 'harold@eagleforceemploymentservices.com',
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
  const { number } = req.body
  mailTo(number, (err, data) => {
    res.send({
      number,
      formResponse: err,
    })
  })
}
