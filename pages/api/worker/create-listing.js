// /api/worker/create-listing
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .post(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')

      const workers = await db.collection('workers').find({})
      // .sort({ metacritic: -1 })
      // .limit(10)
      // .toArray();

      console.log(workers)
      res.json(req.body)
    } catch (e) {
      console.error(e)
    }
  })

export default handler
