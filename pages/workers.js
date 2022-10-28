import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../Components/Layout'
import styles from '../styles/Workers.module.scss'
import axios from 'axios'
import Fuse from 'fuse.js'

import { useEffect, useState } from 'react'
import WorkerListingBlock from '../Components/WorkerListingBlock'
import FeaturedWorkerListingBlock from '../Components/FeaturedWorkerListingBlock'
import WorkerListingSide from '../Components/WorkerListingSide'

export default function Workers({}) {
  const { query } = useRouter()
  const router = useRouter()

  const [error, setError] = useState({})
  const [selectedWorker, setSelectedWorker] = useState([])
  const [loading, setLoading] = useState(false)

  const [searchInput, setSearchInput] = useState('')

  const [listings, setListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })
  const [displayListings, setDisplayListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })
  const [fuzzyListings, setFuzzyListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })
  const [isFuzzy, setIsFuzzy] = useState(false)
  const [proximityListings, setProximityListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })
  const [skillListings, setSkillListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })
  const [employmentListings, setEmploymentListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })
  const [typeListings, setTypeListings] = useState({
    featuredWorkers: [],
    standardWorkers: [],
  })

  const [skillLevels, setSkillLevels] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/worker/get-workers`
        )
        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data)))
      } catch (e) {
        console.error(e)
        setError(JSON.parse(JSON.stringify(e)))
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let editedListings = listings

    if (query && query.search && query.search != '' && editedListings) {
      setSearchInput(query.search)

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
      const pattern = query.search || ''
      const featuredSearch = fuseFeatured.search(pattern)
      const standardSearch = fuseStandard.search(pattern)
      // setIsFiltered(true)
      const itemizedFeaturedSearch = []
      const itemizedStandardSearch = []
      featuredSearch.forEach((item) => itemizedFeaturedSearch.push(item.item))
      standardSearch.forEach((item) => itemizedStandardSearch.push(item.item))
      // setIsFuzzy(true)
      editedListings = {
        featuredWorkers: itemizedFeaturedSearch,
        standardWorkers: itemizedStandardSearch,
      }
    }
    if (query.skillLevel) {
      const splitQuerySkills = query.skillLevel.split('-')
      setSkillLevels(splitQuerySkills)
      const listingsForFunction = [
        editedListings.featuredWorkers,
        editedListings.standardWorkers,
      ]

      const newListings = [[], []]
      listingsForFunction.forEach((list, index) => {
        list.forEach((listing) => {
          splitQuerySkills.forEach((skill) => {
            if (listing.listingInfo[1] == skill) {
              if (!newListings[index].includes(listing)) {
                newListings[index].push(listing)
              }
            }
          })
        })
      })
      editedListings = {
        featuredWorkers: newListings[0],
        standardWorkers: newListings[1],
      }
    }

    router.isReady && setDisplayListings(editedListings)
  }, [query, listings])

  const showFullListing = (number, type) => {
    const worker = listings[type].filter((item) => item.workerNumber == number)
    setSelectedWorker(worker[0])
  }

  const setFilters = (level) => {
    //Skill Filter
    let updatedSkillLevels = []
    if (skillLevels.includes(level)) {
      setSkillLevels(skillLevels.filter((skill) => skill != level))
      updatedSkillLevels = skillLevels.filter((skill) => skill != level)
    } else {
      setSkillLevels([...skillLevels, level])
      updatedSkillLevels = [...skillLevels, level]
    }

    const mySkillQueryString = updatedSkillLevels
      .map((el) => {
        return el
      })
      .join('-')

    //sendind to url with query
    window.location.href = `/workers?search=${searchInput}&skillLevel=${mySkillQueryString}`
  }

  // const setProximity = async () => {
  //   const distance = await axios.get(
  //     `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{coordinates}?access_token=${MAPBOX_TOKEN}`
  //   )
  // }

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
                <button
                // onClick={setProximity}
                >
                  Apply
                </button>
              </div>
              <div className={styles.workers__filter__scroll__checks}>
                <h3>Skill Level</h3>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      skillLevels.length > 0 && skillLevels.includes('Beginner')
                    }
                    onClick={() => setFilters('Beginner')}
                  />
                  Beginner
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      skillLevels.length > 0 && skillLevels.includes('Advanced')
                    }
                    onClick={() => setFilters('Advanced')}
                  />
                  Advanced
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      skillLevels.length > 0 &&
                      skillLevels.includes('Expert Foreman Grade')
                    }
                    onClick={() => setFilters('Expert Foreman Grade')}
                  />
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && setFilters('')}
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
                {displayListings &&
                  displayListings.featuredWorkers &&
                  displayListings.featuredWorkers.map((worker) => (
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
                {displayListings &&
                  displayListings.standardWorkers &&
                  displayListings.standardWorkers.map((worker) => (
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
