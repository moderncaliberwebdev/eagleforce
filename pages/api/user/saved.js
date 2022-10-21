// /api/worker/create-listing
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'
import { withAuth } from '../../../middleware/auth.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .get(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const users = db.collection('users')

      const user = await users.findOne({ email: req.query.email })

      const listings = user.savedListings
      const workers = db.collection('workers')
      const userListings = workers.find({
        workerNumber: { $in: [...listings] },
      })

      res.json({ userListings })
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
