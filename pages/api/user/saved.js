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
      const workers = db.collection('workers')

      const user = await users.findOne({ email: req.query.email })

      const listings = []

      user.savedListings.forEach((listing) => {
        listings.push(Number(listing.split('#')[1]))
      })

      await workers
        .find({ workerNumber: { $in: listings } })
        .toArray(function (err, docs) {
          const featuredWorkers = docs
            .filter((item) => item.listingType == 'Featured')
            .sort((a, b) => b.date - a.date)
          const standardWorkers = docs
            .filter((item) => item.listingType == 'Standard')
            .sort((a, b) => b.date - a.date)
          res.json({ featuredWorkers, standardWorkers })
        })
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
