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
      const workers = db.collection('workers')
      const users = db.collection('users')

      const worker = await workers.findOneAndDelete({
        user: req.body.email,
        workerNumber: req.body.number,
      })

      const previousListing = await users.updateOne(
        { email: req.body.email },
        { $addToSet: { previousListings: worker.value } }
      )

      res.json({ previousListing, worker })
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
