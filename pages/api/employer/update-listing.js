// /api/user/fullName
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'
import { withAuth } from '../../../middleware/auth.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .put(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const employers = db.collection('employers')

      const worker = await employers.updateOne(
        { user: req.body.email, employerNumber: req.body.number },
        { $set: { listingInfo: req.body.listingInfo } }
      )
      res.json(worker)
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
