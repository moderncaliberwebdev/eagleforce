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
      const users = db.collection('users')

      const user = await users.updateOne(
        { email: req.body.email },
        { $set: { name: req.body.name } }
      )
      res.json(user)
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
