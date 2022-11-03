import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../Components/Layout'
import styles from '../styles/Employers.module.scss'
import axios from 'axios'
import Fuse from 'fuse.js'
import haversine from 'haversine-distance'

import { useEffect, useState } from 'react'
import EmployerListingBlock from '../Components/EmployerListingBlock'
import FeaturedEmployerListingBlock from '../Components/FeaturedEmployerListingBlock'
import EmployerListingSide from '../Components/EmployerListingSide'

export default function Employers({}) {
  const { query } = useRouter()
  const router = useRouter()

  const [error, setError] = useState({})
  const [selectedEmployer, setSelectedEmployer] = useState([])
  const [loading, setLoading] = useState(false)

  const [searchInput, setSearchInput] = useState('')

  const [listings, setListings] = useState({
    featuredEmployers: [],
    standardEmployers: [],
  })
  const [displayListings, setDisplayListings] = useState({
    featuredEmployers: [],
    standardEmployers: [],
  })

  const [employmentTypes, setEmploymentTypes] = useState([])
  const [workerTypes, setWorkerTypes] = useState([])
  const [rateStart, setRateStart] = useState('')
  const [rateEnd, setRateEnd] = useState('')
  const [proximityInput, setProximityInput] = useState('')
  const [proximityDistance, setProximityDistance] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/employer/get-employers`
        )
        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data)))
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const getQueries = async () => {
      let editedListings = listings

      if (query && query.search && query.search != '' && editedListings) {
        setSearchInput(query.search)

        const options = {
          keys: [
            ['listingInfo', 0],
            ['listingInfo', 1],
            ['listingInfo', 10],
          ],
          includeScore: true,
          ignoreLocation: true,
          threshold: 0.3,
        }
        const fuseFeatured = new Fuse(listings.featuredEmployers, options)
        const fuseStandard = new Fuse(listings.standardEmployers, options)
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
          featuredEmployers: itemizedFeaturedSearch,
          standardEmployers: itemizedStandardSearch,
        }
      }

      if (query.employmentType) {
        const splitQueryEmployment = query.employmentType.split('-')
        setEmploymentTypes(splitQueryEmployment)

        const listingsForFunction = [
          editedListings.featuredEmployers,
          editedListings.standardEmployers,
        ]

        const newListings = [[], []]
        listingsForFunction.forEach((list, index) => {
          list.forEach((listing) => {
            splitQueryEmployment.forEach((type) => {
              if (listing.listingInfo[6].includes(type)) {
                if (!newListings[index].includes(listing)) {
                  newListings[index].push(listing)
                }
              }
            })
          })
        })
        editedListings = {
          featuredEmployers: newListings[0],
          standardEmployers: newListings[1],
        }
      }
      if (query.workerType) {
        const splitQueryWorker = query.workerType.split('-')
        setWorkerTypes(splitQueryWorker)

        const listingsForFunction = [
          editedListings.featuredEmployers,
          editedListings.standardEmployers,
        ]

        const newListings = [[], []]
        listingsForFunction.forEach((list, index) => {
          list.forEach((listing) => {
            splitQueryWorker.forEach((type) => {
              if (listing.listingInfo[3] == type) {
                if (!newListings[index].includes(listing)) {
                  newListings[index].push(listing)
                }
              }
            })
          })
        })
        editedListings = {
          featuredEmployers: newListings[0],
          standardEmployers: newListings[1],
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
          editedListings.featuredEmployers,
          editedListings.standardEmployers,
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
          featuredEmployers: listingsLocationArr[0],
          standardEmployers: listingsLocationArr[1],
        }
      }
      if (query.rateStart || query.rateEnd) {
        setRateStart(query.rateStart || '')
        setRateEnd(query.rateEnd || '')

        const listingsForFunction = [
          editedListings.featuredEmployers,
          editedListings.standardEmployers,
        ]

        const listingsHourlyArr = [[], []]

        listingsForFunction.forEach((list, index) => {
          list.forEach((listing) => {
            const searchRateStart = query.rateStart || ''
            const searchRateEnd = query.rateEnd || ''
            const employerRateStart = listing.listingInfo[4]
            const employerRateEnd = listing.listingInfo[5]

            if (
              searchRateStart <= employerRateEnd &&
              searchRateEnd >= employerRateStart
            ) {
              listingsHourlyArr[index].push(listing)
            } else if (
              searchRateStart == '' &&
              searchRateEnd >= employerRateEnd
            ) {
              listingsHourlyArr[index].push(listing)
            } else if (
              searchRateEnd == '' &&
              searchRateStart <= employerRateStart
            ) {
              listingsHourlyArr[index].push(listing)
            }
          })
        })

        editedListings = {
          featuredEmployers: listingsHourlyArr[0],
          standardEmployers: listingsHourlyArr[1],
        }
      }

      router.isReady && setDisplayListings(editedListings)
    }

    getQueries()
  }, [query, listings])

  const showFullListing = (number, type) => {
    const worker = listings[type].filter(
      (item) => item.employerNumber == number
    )
    setSelectedEmployer(worker[0])
  }

  const resetFilters = () => {
    window.location.href = `/employers?search=${searchInput}&employmentType=&workerType=&location=&prox=&rateStart=&rateEnd=`
  }

  const setFilters = (employment, worker, rateStart, rateEnd) => {
    //Employment Type Filter
    let updatedEmploymentTypes = []
    if (employmentTypes.includes(employment)) {
      setEmploymentTypes(employmentTypes.filter((type) => type != employment))
      updatedEmploymentTypes = employmentTypes.filter(
        (type) => type != employment
      )
    } else {
      setEmploymentTypes([...employmentTypes, employment])
      updatedEmploymentTypes = [...employmentTypes, employment]
    }

    const myEmploymentQueryString = updatedEmploymentTypes
      .map((el) => {
        return el
      })
      .join('-')

    //Worker Type Filter
    let updatedWorkerTypes = []
    if (workerTypes.includes(worker)) {
      setWorkerTypes(workerTypes.filter((type) => type != worker))
      updatedWorkerTypes = workerTypes.filter((type) => type != worker)
    } else {
      setWorkerTypes([...workerTypes, worker])
      updatedWorkerTypes = [...workerTypes, worker]
    }

    const myWorkerQueryString = updatedWorkerTypes
      .map((el) => {
        return el
      })
      .join('-')

    //proximity filter
    const isProximityUsed =
      proximityInput.length > 0 && proximityDistance.length > 0

    //hourly filter
    const isHourlyUsed = rateStart.length > 0 || rateEnd.length > 0

    //sending to url with query
    window.location.href = `/employers?search=${searchInput}&employmentType=${myEmploymentQueryString}&workerType=${myWorkerQueryString}&location=${
      isProximityUsed ? proximityInput : ''
    }&prox=${isProximityUsed ? proximityDistance : ''}&rateStart=${
      isHourlyUsed ? rateStart : ''
    }&rateEnd=${isHourlyUsed ? rateEnd : ''}`
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Employers | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Connect with employers and find the best job for you'
        />
        <meta
          property='og:title'
          content='Employers | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Connect with employers and find the best job for you'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/employers'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.workers}>
          <div className={styles.workers__filter}>
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
                  value={proximityDistance.length > 0 ? proximityDistance : ''}
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
                      setFilters('', '', '', '')
                    } else
                      setError(
                        'Fill in a location and a proximity before clicking Apply'
                      )
                  }}
                >
                  Apply
                </button>
              </div>

              <div className={styles.workers__filter__scroll__hourly}>
                <h3>Hourly Pay</h3>
                <div className={styles.workers__filter__scroll__hourly__inputs}>
                  <div
                    className={
                      styles.workers__filter__scroll__hourly__inputs__input
                    }
                  >
                    <p>$</p>
                    <input
                      type='text'
                      value={rateStart}
                      onChange={(e) => setRateStart(e.target.value)}
                    />
                  </div>
                  <p>to</p>
                  <div
                    className={
                      styles.workers__filter__scroll__hourly__inputs__input
                    }
                  >
                    <p>$</p>
                    <input
                      type='text'
                      value={rateEnd}
                      onChange={(e) => setRateEnd(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (
                      rateStart.length > 0 &&
                      rateEnd.length > 0 &&
                      rateEnd <= rateStart
                    ) {
                      setError('End rate must be greater than start rate')
                    } else {
                      setFilters('', '', rateStart, rateEnd)
                    }
                  }}
                >
                  Apply
                </button>
              </div>

              <div className={styles.workers__filter__scroll__checks}>
                <h3>Employment Type</h3>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      employmentTypes.length > 0 &&
                      employmentTypes.includes('Full Time')
                    }
                    onClick={() => setFilters('Full Time', '', '', '')}
                  />
                  Full Time
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      employmentTypes.length > 0 &&
                      employmentTypes.includes('Part Time')
                    }
                    onClick={() => setFilters('Part Time', '', '', '')}
                  />
                  Part Time
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      employmentTypes.length > 0 &&
                      employmentTypes.includes('Contract')
                    }
                    onClick={() => setFilters('Contract', '', '', '')}
                  />
                  Contract
                </label>
              </div>
              <div className={styles.workers__filter__scroll__checks}>
                <h3>Worker Type</h3>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      workerTypes.length > 0 && workerTypes.includes('Worker')
                    }
                    onClick={() => setFilters('', 'Worker', '', '')}
                  />
                  Worker
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      workerTypes.length > 0 &&
                      workerTypes.includes('Crew Driver')
                    }
                    onClick={() => setFilters('', 'Crew Driver', '', '')}
                  />
                  Crew Driver
                </label>
                <label
                  className={styles.workers__filter__scroll__checks__check}
                >
                  <input
                    type='checkbox'
                    defaultChecked={
                      workerTypes.length > 0 && workerTypes.includes('Both')
                    }
                    onClick={() => setFilters('', 'Both', '', '')}
                  />
                  Both
                </label>
              </div>
            </div>
          </div>
          <div className={styles.workers__listings}>
            <input
              type='text'
              className={styles.workers__listings__search}
              placeholder='Search by job title, trade, or company'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && setFilters('', '', '', '')
              }
            />
            <p className={styles.workers__listings__notice}>
              All verified workers have been screened by the site administrator
            </p>
            {loading ? (
              <p className={styles.workers__listings__loading}>
                Loading Workers...
              </p>
            ) : displayListings &&
              displayListings.featuredEmployers &&
              displayListings.featuredEmployers.length == 0 &&
              displayListings.standardEmployers &&
              displayListings.standardEmployers.length == 0 ? (
              <p className={styles.workers__listings__loading}>No Results</p>
            ) : (
              <div className={styles.workers__listings__display}>
                {displayListings &&
                  displayListings.featuredEmployers &&
                  displayListings.featuredEmployers.map((employer) => (
                    <FeaturedEmployerListingBlock
                      key={employer.listingInfo[0]}
                      job={employer.listingInfo[0]}
                      number={employer.employerNumber}
                      company={employer.listingInfo[1]}
                      city={employer.listingInfo[7]}
                      type={employer.listingInfo[3]}
                      employmentType={employer.listingInfo[6]}
                      description={employer.listingInfo[10]}
                      logo={employer.logo}
                      showFullListing={showFullListing}
                    />
                  ))}
                {displayListings &&
                  displayListings.standardEmployers &&
                  displayListings.standardEmployers.map((employer) => (
                    <EmployerListingBlock
                      key={employer.listingInfo[0]}
                      job={employer.listingInfo[0]}
                      number={employer.employerNumber}
                      company={employer.listingInfo[1]}
                      city={employer.listingInfo[7]}
                      type={employer.listingInfo[3]}
                      employmentType={employer.listingInfo[6]}
                      description={employer.listingInfo[10]}
                      logo={employer.logo}
                      showFullListing={showFullListing}
                    />
                  ))}
              </div>
            )}
          </div>

          <EmployerListingSide
            job={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[0]
            }
            number={selectedEmployer && selectedEmployer.employerNumber}
            email={selectedEmployer && selectedEmployer.user}
            company={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[1]
            }
            website={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[2]
            }
            type={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[3]
            }
            city={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[7]
            }
            employmentType={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[6]
            }
            description={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[10]
            }
            rateStart={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[4]
            }
            rateEnd={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[5]
            }
            experience={
              selectedEmployer &&
              selectedEmployer.listingInfo &&
              selectedEmployer.listingInfo[11]
            }
            logo={selectedEmployer && selectedEmployer.logo}
          />
        </main>
      </Layout>
    </div>
  )
}
