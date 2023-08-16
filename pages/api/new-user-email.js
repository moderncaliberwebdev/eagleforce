import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailTo = (callback) => {
  //validation
  const output = `
                <h3>New User!</h3> 
                Congratulations, someone posted a new listing! Go check out their listing here eagleforceemploymentservices.com/profile
            `
  const msg = {
    from: {
      name: 'Eagle Force Worker Contact',
      email: 'support@eagleforceemploymentservices.com',
    },
    to: 'harold@eagleforceemploymentservices.com',
    subject: 'New Eagle Force Listing',
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

export default function mail(req, res) {
  mailTo((err, data) => {
    res.send({
      formResponse: err,
    })
  })
}
