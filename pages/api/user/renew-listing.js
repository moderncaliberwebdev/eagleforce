// /api/user/fullName
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'
import { withAuth } from '../../../middleware/auth.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .post(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const workers = db.collection('workers')
      const users = db.collection('users')

      const user = await users.findOneAndUpdate(
        {
          email: req.body.email,
        },
        { $pull: { previousListings: { workerNumber: req.body.number } } }
      )
      console.log(user.value.previousListings)

      let previousListing
      user.value.previousListings.forEach((listing) => {
        if (listing.workerNumber == req.body.number) {
          previousListing = listing
        }
      })

      const { _id, ...newListing } = previousListing

      await workers.insertOne(newListing)

      res.json({ newListing })
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
