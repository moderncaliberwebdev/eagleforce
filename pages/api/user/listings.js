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
      const workers = db.collection('workers')

      await workers
        .find({ user: req.query.email })
        .toArray(function (err, docs) {
          res.json({ docs })
        })
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
