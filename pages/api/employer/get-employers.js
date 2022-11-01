// /api/worker/create-listing
import nc from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db.js'

const handler = nc()
  // use connect based middleware
  .use(cors())

  // express like routing for methods
  .get(async (req, res) => {
    try {
      const client = await clientPromise
      const db = client.db('eagleforce')
      const employers = db.collection('employers')

      await employers.find({}).toArray(function (err, docs) {
        const featuredEmployers = docs
          .filter((item) => item.listingType == 'Featured')
          .sort((a, b) => b.date - a.date)
        const standardEmployers = docs
          .filter((item) => item.listingType == 'Standard')
          .sort((a, b) => b.date - a.date)
        res.json({ featuredEmployers, standardEmployers })
      })
    } catch (e) {
      console.error(e)
    }
  })

export default handler
