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
        { email: req.body.email, savedListings: { $exists: true } },
        { $addToSet: { savedListings: req.body.number } }
      )
      res.json(user)
    } catch (e) {
      console.error(e)
    }
  })

  .get(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const users = db.collection('users')

      const user = await users.findOne({
        email: req.query.email,
      })

      res.json(user.savedListings)
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
