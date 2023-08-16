import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailTo = (fullName, email, message, callback) => {
  //validation
  if (!fullName || !email || !message) {
    return callback('Please fill in all fields', undefined)
  } else if (!validator.isEmail(email)) {
    return callback('Provide a valid email', undefined)
  } else {
    const output = `
                <h3>Name: </h3> ${fullName}
                <h3>Email: </h3> ${email}
                <h3>Message: </h3> ${message}
            `
    const msg = {
      from: {
        name: 'Eagle Force Worker Contact',
        email: 'support@eagleforceemploymentservices.com',
      },
      replyTo: email,
      to: 'verify@eagleforceemploymentservices.com',
      subject: 'Eagle Force Get Verified Request',
      html: output,
    }
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
  }
}

export default function mail(req, res) {
  const { fullName, email, message } = req.body
  mailTo(fullName, email, message, (err, data) => {
    res.send({
      fullName,
      email,
      message,
      formResponse: err,
    })
  })
}
