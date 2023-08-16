import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailTo = (number, callback) => {
  //validation
  const output = `
    <h3>Updated User!</h3> 
    Employer ${number} just updated their listing. Check it out and approve it at eagleforceemploymentservices.com/profile/employers
            `
  const msg = {
    from: {
      name: 'Eagle Force Employer Contact',
      email: 'support@eagleforceemploymentservices.com',
    },
    to: 'harold@eagleforceemploymentservices.com',
    subject: 'Updated User Listings',
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
  const { number } = req.body
  mailTo(number, (err, data) => {
    res.send({
      number,
      formResponse: err,
    })
  })
}
