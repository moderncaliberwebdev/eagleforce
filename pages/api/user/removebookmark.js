// /api/user/removebookmark
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

      console.log('remove bookmark >>> ', req.body.number)

      const user = await users.updateOne(
        { email: req.body.email, savedListings: { $exists: true } },
        { $pull: { savedListings: { $in: [req.body.number] } } }
      )
      res.json(user)
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
