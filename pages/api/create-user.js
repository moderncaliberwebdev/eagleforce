// /api/worker/create-listing
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../utils/db'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .post(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const users = db.collection('users')

      const newUser = await users.insertOne(req.body)
      res.json(newUser)
    } catch (e) {
      console.error(e)
    }
  })

export default handler
