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
        const employers = db.collection('employers')

        const newEmployer = await employers.insertOne(req.body)
        res.json(newEmployer)
      }
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
