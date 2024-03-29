// /api/worker/create-listing
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'
import { withAdminAuth } from '../../../middleware/adminAuth.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .get(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const users = db.collection('users')

      await users.find({}).toArray(function (err, docs) {
        res.json(docs)
      })
    } catch (e) {
      console.error(e)
    }
  })

export default withAdminAuth(handler)
