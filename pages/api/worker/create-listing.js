// /api/worker/create-listing
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
      if (req.body.orderID && req.body.orderDetails.status == 'ACTIVE') {
        const client = await clientPromise
        const db = client.db('eagleforce')
        const workers = db.collection('workers')

        const newWorker = await workers.insertOne(req.body)
        res.json(newWorker)
      }
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
