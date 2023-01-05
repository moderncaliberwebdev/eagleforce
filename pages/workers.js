import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../Components/Layout'
import styles from '../styles/Workers.module.scss'
import axios from 'axios'
import Fuse from 'fuse.js'
import haversine from 'haversine-distance'

import { useMediaQuery } from 'react-responsive'

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

  const [skillLevels, setSkillLevels] = useState([])
  const [employmentTypes, setEmploymentTypes] = useState([])
  const [workerTypes, setWorkerTypes] = useState([])
  const [proximityInput, setProximityInput] = useState('')
  const [proximityDistance, setProximityDistance] = useState('')
  const [isSmallScreenState, setIsSmallScreenState] = useState(false)
  const [isPhoneState, setIsPhoneState] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)

  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' })
  const isPhone = useMediaQuery({ query: '(max-width: 600px)' })

  useEffect(() => {
    setIsSmallScreenState(isSmallScreen)
  }, [isSmallScreen])
  useEffect(() => {
    setIsPhoneState(isPhone)
  }, [isPhone])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await axios.get(`/api/worker/get-workers`)
        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data)))
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    console.log('employmenttypes state >>', employmentTypes)
  }, [employmentTypes])

  useEffect(() => {
    const getQueries = async () => {
      let editedListings = listings

      if (query && query.search && query.search != '' && editedListings) {
        setSearchInput(query.search)

        const options = {
          keys: [
            ['listingInfo', 0],
            ['listingInfo', 10, 0, 0],
            ['listingInfo', 11],
            'workerNumber',
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
      if (query.employmentType) {
        const splitQueryEmployment = query.employmentType.split('-')
        setEmploymentTypes(splitQueryEmployment)

        const listingsForFunction = [
          editedListings.featuredWorkers,
          editedListings.standardWorkers,
        ]

        const newListings = [[], []]
        listingsForFunction.forEach((list, index) => {
          list.forEach((listing) => {
            splitQueryEmployment.forEach((type) => {
              if (listing.listingInfo[5].includes(type)) {
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
      if (query.workerType) {
        const splitQueryWorker = query.workerType.split('-')
        setWorkerTypes(splitQueryWorker)

        const listingsForFunction = [
          editedListings.featuredWorkers,
          editedListings.standardWorkers,
        ]

        const newListings = [[], []]
        listingsForFunction.forEach((list, index) => {
          list.forEach((listing) => {
            splitQueryWorker.forEach((type) => {
              if (listing.listingInfo[2] == type) {
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
      if (query.location) {
        setProximityInput(query.location)
        setProximityDistance(query.prox)

        const data = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${query.location}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
        )

        const userLocation = data.data.results[0].geometry.location

        const listingsForFunction = [
          editedListings.featuredWorkers,
          editedListings.standardWorkers,
        ]

        const listingsLocationArr = [[], []]

        listingsForFunction.forEach((list, index) => {
          list.forEach((listing) => {
            if (
              haversine(userLocation, listing.geocode) / 1609.34 <
              query.prox.split(' ')[0]
            ) {
              listingsLocationArr[index].push(listing)
            }
          })
        })

        editedListings = {
          featuredWorkers: listingsLocationArr[0],
          standardWorkers: listingsLocationArr[1],
        }
      }

      router.isReady && setDisplayListings(editedListings)
    }

    getQueries()
  }, [query, listings])

  const showFullListing = (number, type) => {
    const worker = listings[type].filter((item) => item.workerNumber == number)
    setSelectedWorker(worker[0])
  }

  const hideFullListing = () => {
    setSelectedWorker([])
  }

  const resetFilters = () => {
    setSkillLevels([])
    setEmploymentTypes([])
    setWorkerTypes([])
    setProximityInput('')
    setProximityDistance('')
    router.push(
      `/workers?search=${searchInput}&skillLevel=&employmentType=&workerType=&location=&prox=`,
      undefined,
      { scroll: false }
    )
  }

  const setFilters = (level, employment, worker, location, proximity) => {
    //Skill Filter
    let updatedSkillLevels = []
    if (skillLevels.includes(level)) {
      setSkillLevels(skillLevels.filter((skill) => skill != level))
      updatedSkillLevels = skillLevels.filter(
        (skill) => skill != level && skill != ''
      )
    } else {
      if (level == '') {
        setSkillLevels([...skillLevels])
        updatedSkillLevels = [...skillLevels]
      } else {
        setSkillLevels([...skillLevels, level])
        updatedSkillLevels = [...skillLevels, level]
      }
    }

    const mySkillQueryString = updatedSkillLevels
      .map((el) => {
        return el
      })
      .join('-')

    //Employment Type Filter
    let updatedEmploymentTypes = []
    if (employmentTypes.includes(employment)) {
      setEmploymentTypes(employmentTypes.filter((type) => type != employment))
      updatedEmploymentTypes = employmentTypes.filter(
        (type) => type != employment && type != ''
      )
    } else {
      if (employment == '') {
        setEmploymentTypes([...employmentTypes])
        updatedEmploymentTypes = [...employmentTypes]
      } else {
        setEmploymentTypes([...employmentTypes, employment])
        updatedEmploymentTypes = [...employmentTypes, employment]
      }
    }

    console.log(updatedEmploymentTypes)
    const myEmploymentQueryString = updatedEmploymentTypes
      .map((el) => {
        return el
      })
      .join('-')

    console.log(myEmploymentQueryString)

    //Worker Type Filter
    let updatedWorkerTypes = []
    if (workerTypes.includes(worker)) {
      setWorkerTypes(workerTypes.filter((type) => type != worker))
      updatedWorkerTypes = workerTypes.filter(
        (type) => type != worker && type != ''
      )
    } else {
      if (worker == '') {
        setWorkerTypes([...workerTypes])
        updatedWorkerTypes = [...workerTypes]
      } else {
        setWorkerTypes([...workerTypes, worker])
        updatedWorkerTypes = [...workerTypes, worker]
      }
    }

    const myWorkerQueryString = updatedWorkerTypes
      .map((el) => {
        return el
      })
      .join('-')

    const isProximityUsed =
      proximityInput.length > 0 && proximityDistance.length > 0

    //sending to url with query
    router.push(
      `/workers?search=${searchInput.replace(
        '#',
        ''
      )}&skillLevel=${mySkillQueryString}&employmentType=${myEmploymentQueryString}&workerType=${myWorkerQueryString}&location=${
        isProximityUsed ? proximityInput : ''
      }&prox=${isProximityUsed ? proximityDistance : ''}`,
      undefined,
      { scroll: false }
    )
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
          {isSmallScreenState &&
          selectedWorker &&
          selectedWorker.listingInfo ? (
            <></>
          ) : (
            <>
              {(!isPhoneState || openFilter) && (
                <div className={styles.workers__filter}>
                  {isPhoneState && (
                    <img
                      className={styles.workers__filter__arrow}
                      src='/images/layout/arrow.png'
                      alt='arrow'
                      onClick={() => setOpenFilter(false)}
                    />
                  )}
                  <div className={styles.workers__filter__top}>
                    <h2>Filter Search</h2>
                    <p onClick={resetFilters}>Reset</p>
                  </div>
                  <div className={styles.workers__filter__scroll}>
                    <div className={styles.workers__filter__scroll__location}>
                      <h3>Location</h3>
                      <input
                        type='text'
                        placeholder='Lancaster, PA'
                        value={proximityInput}
                        onChange={(e) => setProximityInput(e.target.value)}
                      />
                      <select
                        required
                        value={
                          proximityDistance.length > 0 ? proximityDistance : ''
                        }
                        onChange={(e) => setProximityDistance(e.target.value)}
                      >
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
                        onClick={() => {
                          if (
                            proximityInput.length > 0 &&
                            proximityDistance.length > 0
                          ) {
                            setFilters(
                              '',
                              '',
                              '',
                              proximityInput,
                              proximityDistance
                            )
                          } else
                            setError(
                              'Fill in a location and a proximity before clicking Apply'
                            )
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    <div className={styles.workers__filter__scroll__checks}>
                      <h3>Skill Level</h3>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            skillLevels.length > 0 &&
                            skillLevels.includes('Beginner')
                          }
                          onClick={() => setFilters('Beginner', '', '', '', '')}
                        />
                        Beginner
                      </label>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            skillLevels.length > 0 &&
                            skillLevels.includes('Advanced')
                          }
                          onClick={() => setFilters('Advanced', '', '', '', '')}
                        />
                        Advanced
                      </label>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            skillLevels.length > 0 &&
                            skillLevels.includes('Expert Foreman Grade')
                          }
                          onClick={() =>
                            setFilters('Expert Foreman Grade', '', '', '', '')
                          }
                        />
                        Expert Foreman Grade
                      </label>
                    </div>
                    <div className={styles.workers__filter__scroll__checks}>
                      <h3>Employment Type</h3>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            employmentTypes.length > 0 &&
                            employmentTypes.includes('Full Time')
                          }
                          onClick={() =>
                            setFilters('', 'Full Time', '', '', '')
                          }
                        />
                        Full Time
                      </label>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            employmentTypes.length > 0 &&
                            employmentTypes.includes('Part Time')
                          }
                          onClick={() =>
                            setFilters('', 'Part Time', '', '', '')
                          }
                        />
                        Part Time
                      </label>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            employmentTypes.length > 0 &&
                            employmentTypes.includes('Contract')
                          }
                          onClick={() => setFilters('', 'Contract', '', '', '')}
                        />
                        Contract
                      </label>
                    </div>
                    <div className={styles.workers__filter__scroll__checks}>
                      <h3>Worker Type</h3>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            workerTypes.length > 0 &&
                            workerTypes.includes('Worker')
                          }
                          onClick={() => setFilters('', '', 'Worker', '', '')}
                        />
                        Worker
                      </label>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            workerTypes.length > 0 &&
                            workerTypes.includes('Crew Driver')
                          }
                          onClick={() =>
                            setFilters('', '', 'Crew Driver', '', '')
                          }
                        />
                        Crew Driver
                      </label>
                      <label
                        className={
                          styles.workers__filter__scroll__checks__check
                        }
                      >
                        <input
                          type='checkbox'
                          checked={
                            workerTypes.length > 0 &&
                            workerTypes.includes('Both')
                          }
                          onClick={() => setFilters('', '', 'Both', '', '')}
                        />
                        Both
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {!openFilter && (
                <div className={styles.workers__listings}>
                  <input
                    type='text'
                    className={styles.workers__listings__search}
                    placeholder='Search by job title, trade, or worker number'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && setFilters('', '', '', '', '')
                    }
                  />
                  <p className={styles.workers__listings__notice}>
                    All verified workers have been screened by the site
                    administrator
                  </p>
                  {isPhoneState && (
                    <div
                      className={styles.workers__listings__filter}
                      onClick={() => {
                        setOpenFilter(true)
                      }}
                    >
                      <img src='/images/post/filter.png' alt='Filter' />
                      <h3>Filter Search</h3>
                    </div>
                  )}
                  {loading ? (
                    <p className={styles.workers__listings__loading}>
                      Loading Workers...
                    </p>
                  ) : displayListings &&
                    displayListings.featuredWorkers &&
                    displayListings.featuredWorkers.length == 0 &&
                    displayListings.standardWorkers &&
                    displayListings.standardWorkers.length == 0 ? (
                    <p className={styles.workers__listings__loading}>
                      No Results
                    </p>
                  ) : (
                    <div className={styles.workers__listings__display}>
                      {displayListings &&
                        displayListings.featuredWorkers &&
                        displayListings.featuredWorkers.map((worker) => (
                          <>
                            {worker.approved && (
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
                                verified={worker.verified}
                              />
                            )}
                          </>
                        ))}
                      {displayListings &&
                        displayListings.standardWorkers &&
                        displayListings.standardWorkers.map((worker) => (
                          <>
                            {worker.approved && (
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
                                verified={worker.verified}
                              />
                            )}
                          </>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
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
            hideFullListing={hideFullListing}
          />
        </main>
      </Layout>
    </div>
  )
}
