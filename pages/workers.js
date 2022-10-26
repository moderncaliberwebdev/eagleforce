import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../Components/Layout'
import styles from '../styles/Workers.module.scss'
import axios from 'axios'
import Fuse from 'fuse.js'

import { useEffect, useState } from 'react'
import WorkerListingBlock from '../Components/WorkerListingBlock'
import FeaturedWorkerListingBlock from '../Components/FeaturedWorkerListingBlock'
import WorkerListingSide from '../Components/WorkerListingSide'
import e from 'cors'

export default function Workers({}) {
  const [listings, setListings] = useState({})
  const [error, setError] = useState({})
  const [selectedWorker, setSelectedWorker] = useState([])
  const [loading, setLoading] = useState(false)
  const [fuzzyStandard, setFuzzyStandard] = useState([])
  const [fuzzyFeatured, setFuzzyFeatured] = useState([])
  const [isFuzzy, setIsFuzzy] = useState(false)

  const [filterFeatured, setFilterFeatured] = useState([])
  const [filterStandard, setFilterStandard] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/worker/get-workers`
        )
        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data)))
        console.log(JSON.parse(JSON.stringify(data.data.featuredWorkers)))
      } catch (e) {
        console.error(e)
        setError(JSON.parse(JSON.stringify(e)))
      }
    }

    fetchData()
  }, [])

  const showFullListing = (number, type) => {
    const worker = listings[type].filter((item) => item.workerNumber == number)
    setSelectedWorker(worker[0])
  }

  const handleSearch = (input) => {
    if (input.length > 0) {
      const options = {
        keys: [
          ['listingInfo', 0],
          ['listingInfo', 10, 0, 0],
          ['listingInfo', 11],
        ],
        includeScore: true,
        ignoreLocation: true,
        threshold: 0.3,
      }

      const fuseFeatured = new Fuse(listings.featuredWorkers, options)
      const fuseStandard = new Fuse(listings.standardWorkers, options)

      // Change the pattern
      const pattern = input

      const featuredSearch = fuseFeatured.search(pattern)
      const standardSearch = fuseStandard.search(pattern)
      console.log(featuredSearch, standardSearch)

      setIsFuzzy(true)
      setFuzzyFeatured(featuredSearch)
      setFuzzyStandard(standardSearch)
    } else {
      setIsFuzzy(false)
      setFuzzyFeatured([])
      setFuzzyStandard([])
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Workers | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Connect with job seekers and find the best candidates for your company'
        />
        <meta
          property='og:title'
          content='Workers | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Connect with job seekers and find the best candidates for your company'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/workers'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.workers}>
          <div className={styles.workers__filter}>
            <div className={styles.workers__filter__top}>
              <h2>Filter Search</h2>
              <p>Reset</p>
            </div>
            <div className={styles.workers__filter__scroll}>
              <div className={styles.workers__filter__scroll__location}>
                <h3>Location</h3>
                <input type='text' placeholder='Lancaster, PA' />
                <select required>
                  <option value='' disabled selected hidden>
                    Proximity
                  </option>
                  <option value='5 Miles'>5 Miles</option>
                  <option value='10 Miles'>10 Miles</option>
                  <option value='20 Miles'>20 Miles</option>
                  <option value='40 Miles'>40 Miles</option>
                  <option value='60 Miles'>60 Miles</option>
                  <option value='80 Miles'>80 Miles</option>
                  <option value='100 Miles'>100 Miles</option>
                  <option value='250 Miles'>250 Miles</option>
                  <option value='500 Miles'>500 Miles</option>
                </select>
                <button>Apply</button>
              </div>
              <div className={styles.workers__filter__scroll__checks}>
                <h3>Skill Level</h3>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Beginner
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Advanced
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Expert Foreman Grade
                </label>
              </div>
              <div className={styles.workers__filter__scroll__checks}>
                <h3>Employment Type</h3>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Full Time
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Part Time
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Contract
                </label>
              </div>
              <div className={styles.workers__filter__scroll__checks}>
                <h3>Worker Type</h3>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Worker
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Crew Driver
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input type='checkbox' />
                  Both
                </label>
              </div>
            </div>
          </div>
          <div className={styles.workers__listings}>
            <input
              type='text'
              className={styles.workers__listings__search}
              placeholder='Search by job title or trade'
              onKeyPress={(e) =>
                e.key === 'Enter' && handleSearch(e.target.value)
              }
            />
            <p className={styles.workers__listings__notice}>
              All verified workers have been screened by the site administrator
            </p>
            {loading ? (
              <p className={styles.workers__listings__loading}>
                Loading Workers...
              </p>
            ) : (
              <div className={styles.workers__listings__display}>
                {fuzzyFeatured && fuzzyFeatured.length > 0
                  ? fuzzyFeatured.map((worker) => (
                      <FeaturedWorkerListingBlock
                        key={worker.item.listingInfo[0]}
                        jobs={worker.item.listingInfo[0]}
                        number={worker.item.workerNumber}
                        type={worker.item.listingInfo[2]}
                        city={worker.item.listingInfo[6]}
                        employmentType={worker.item.listingInfo[5]}
                        skill={worker.item.listingInfo[1]}
                        summary={worker.item.listingInfo[9]}
                        showFullListing={showFullListing}
                      />
                    ))
                  : isFuzzy
                  ? ''
                  : listings &&
                    listings.featuredWorkers &&
                    listings.featuredWorkers.map((worker) => (
                      <FeaturedWorkerListingBlock
                        key={worker.listingInfo[0]}
                        jobs={worker.listingInfo[0]}
                        number={worker.workerNumber}
                        type={worker.listingInfo[2]}
                        city={worker.listingInfo[6]}
                        employmentType={worker.listingInfo[5]}
                        skill={worker.listingInfo[1]}
                        summary={worker.listingInfo[9]}
                        showFullListing={showFullListing}
                      />
                    ))}
                {fuzzyStandard && fuzzyStandard.length > 0
                  ? fuzzyStandard.map((worker) => (
                      <WorkerListingBlock
                        key={worker.item.listingInfo[0]}
                        jobs={worker.item.listingInfo[0]}
                        number={worker.item.workerNumber}
                        type={worker.item.listingInfo[2]}
                        city={worker.item.listingInfo[6]}
                        employmentType={worker.item.listingInfo[5]}
                        skill={worker.item.listingInfo[1]}
                        summary={worker.item.listingInfo[9]}
                        showFullListing={showFullListing}
                      />
                    ))
                  : isFuzzy
                  ? ''
                  : listings &&
                    listings.standardWorkers &&
                    listings.standardWorkers.map((worker) => (
                      <WorkerListingBlock
                        key={worker.listingInfo[0]}
                        jobs={worker.listingInfo[0]}
                        number={worker.workerNumber}
                        type={worker.listingInfo[2]}
                        city={worker.listingInfo[6]}
                        employmentType={worker.listingInfo[5]}
                        skill={worker.listingInfo[1]}
                        summary={worker.listingInfo[9]}
                        showFullListing={showFullListing}
                      />
                    ))}
              </div>
            )}
          </div>

          <WorkerListingSide
            jobs={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[0]
            }
            number={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.workerNumber
            }
            type={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[2]
            }
            city={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[6]
            }
            employmentType={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[5]
            }
            skill={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[1]
            }
            summary={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[9]
            }
            rateStart={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[3]
            }
            rateEnd={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[4]
            }
            experience={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[10]
            }
            highlights={
              selectedWorker &&
              selectedWorker.listingInfo &&
              selectedWorker.listingInfo[11]
            }
          />
        </main>
      </Layout>
    </div>
  )
}
