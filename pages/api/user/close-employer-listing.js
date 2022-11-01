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
      const employers = db.collection('employers')

      const employer = await employers.findOneAndDelete({
        user: req.body.email,
        employerNumber: req.body.number,
      })

      const previousListing = await users.updateOne(
        { email: req.body.email },
        { $addToSet: { previousListings: employer.value } }
      )

      res.json({ previousListing, employer })
    } catch (e) {
      console.error(e)
    }
  })

export default withAuth(handler)
