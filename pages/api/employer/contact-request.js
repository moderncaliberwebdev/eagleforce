import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailTo = (email, yourEmail, message, callback) => {
  //validation
  if (!email || !yourEmail || !message) {
    return callback('Please fill in all fields', undefined)
  } else if (!validator.isEmail(yourEmail)) {
    return callback('Provide a valid email', undefined)
  } else {
    const output = `
                <h3>Sender's Email: </h3> ${yourEmail}
                <h3>Message: </h3> ${message}
            `

    const msg = {
      to: email, // replace with -> to: email
      from: {
        name: 'Eagle Force Employer Contact',
        email: 'support@eagleforceemploymentservices.com',
      },
      replyTo: yourEmail,
      subject: 'Eagle Force Employer Contact Request',
      html: output,
    }
    //ES8
    const sendSGMail = async () => {
      try {
        await sgMail.send(msg)

        callback(undefined, { sent: true })
      } catch (error) {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
    sendSGMail()
    // const mailOptions = {
    //   from: 'contact@eagleforceemploymentservices.com',
    //   to: email,
    //   // to: 'cmartin@moderncaliber.com',
    //   subject: 'Eagle Force Employer Contact Request',
    //   html: output,
    //   replyTo: yourEmail,
    // }
    // transporter.sendMail(mailOptions, (err, data) => {
    //   if (err) {
    //     callback('Internal Error', undefined)
    //   } else {
    //     callback(undefined, data)
    //   }
    // })
  }
}

export default function mail(req, res) {
  const { email, yourEmail, message } = req.body
  mailTo(email, yourEmail, message, (err, data) => {
    res.send({
      email,
      yourEmail,
      message,
      formResponse: err,
    })
  })
}
