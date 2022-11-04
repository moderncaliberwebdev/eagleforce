// /api/user/email
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

      const worker = await workers.updateOne(
        { workerNumber: req.body.number },
        { $set: { verified: true } }
      )
      res.json(worker)
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
