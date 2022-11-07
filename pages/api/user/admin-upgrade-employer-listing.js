// /api/user/fullName
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'
import { withAdminAuth } from '../../../middleware/adminAuth.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .put(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const employers = db.collection('employers')

      const employer = await employers.findOneAndUpdate(
        {
          user: req.body.email,
          employerNumber: req.body.number,
        },
        { $set: { trial: false } }
      )

      res.json({ employer })
    } catch (e) {
      console.error(e)
    }
  })

export default withAdminAuth(handler)
