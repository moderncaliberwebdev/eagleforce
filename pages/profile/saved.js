import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Saved.module.scss'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'
import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'

import WorkerListingSide from '../../Components/WorkerListingSide'
import EmployerListingSide from '../../Components/EmployerListingSide'
import FeaturedWorkerListingBlock from '../../Components/FeaturedWorkerListingBlock'
import FeaturedEmployerListingBlock from '../../Components/FeaturedEmployerListingBlock'
import WorkerListingBlock from '../../Components/WorkerListingBlock'
import EmployerListingBlock from '../../Components/EmployerListingBlock'

const auth = getAuth()

function SavedListings() {
  const [currentUser, setCurrentUser] = useState()
  const [listings, setListings] = useState()
  const [error, setError] = useState({})
  const [selectedWorker, setSelectedWorker] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(
          `/api/user/saved?email=${user.email}`,
          config
        )

        const userData = await axios.get(
          `/api/user?email=${user.email}`,
          config
        )
        setCurrentUser(userData.data.user)

        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data)))
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  const showFullListing = (number, type) => {
    const checkListings = (item) => {
      if (item.workerNumber) {
        return item.workerNumber == number
      } else if (item.employerNumber) {
        return item.employerNumber == number
      }
    }

    const worker = listings[type].filter(checkListings)

    setSelectedWorker(worker[0])
  }

  return (
    <div className={styles.container}>
      <Head>
        <title> Saved Listings | Eagle Force Employment Services</title>
        <meta
          property='og:title'
          content='Saved Listings| Eagle Force Employment Services'
        />

        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/profile/saved'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Saved Listings</h1>
          <ProfileBreadcrumbs admin={currentUser && currentUser.admin} />
          <div className={styles.saved}>
            {loading ? (
              <p className={styles.saved__loading}>Loading Listings...</p>
            ) : listings &&
              ((listings.featuredWorkers &&
                listings.featuredWorkers.length > 0) ||
                (listings.standardWorkers &&
                  listings.standardWorkers.length > 0) ||
                (listings.featuredEmployers &&
                  listings.featuredEmployers.length > 0) ||
                (listings.standardEmployers &&
                  listings.standardEmployers.length > 0)) ? (
              <>
                <div className={styles.saved__listings}>
                  {listings.featuredWorkers &&
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
                        saved={true}
                      />
                    ))}
                  {listings.featuredEmployers &&
                    listings.featuredEmployers.map((employer) => (
                      <FeaturedEmployerListingBlock
                        key={employer.listingInfo[0]}
                        job={employer.listingInfo[0]}
                        number={employer.employerNumber}
                        company={employer.listingInfo[1]}
                        city={employer.listingInfo[7]}
                        type={employer.listingInfo[3]}
                        employmentType={employer.listingInfo[6]}
                        description={employer.listingInfo[10]}
                        showFullListing={showFullListing}
                        logo={employer.logo}
                        saved={true}
                      />
                    ))}
                  {listings.standardWorkers &&
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
                        saved={true}
                      />
                    ))}
                  {listings.standardEmployers &&
                    listings.standardEmployers.map((employer) => (
                      <EmployerListingBlock
                        key={employer.listingInfo[0]}
                        job={employer.listingInfo[0]}
                        number={employer.employerNumber}
                        company={employer.listingInfo[1]}
                        city={employer.listingInfo[7]}
                        type={employer.listingInfo[3]}
                        employmentType={employer.listingInfo[6]}
                        description={employer.listingInfo[10]}
                        showFullListing={showFullListing}
                        logo={employer.logo}
                        saved={true}
                      />
                    ))}
                </div>

                {selectedWorker && selectedWorker.userType == 'Worker' ? (
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
                    refresh={true}
                  />
                ) : (
                  <EmployerListingSide
                    job={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[0]
                    }
                    number={selectedWorker && selectedWorker.employerNumber}
                    email={selectedWorker && selectedWorker.user}
                    company={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[1]
                    }
                    website={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[2]
                    }
                    type={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[3]
                    }
                    city={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[7]
                    }
                    employmentType={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[6]
                    }
                    description={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[10]
                    }
                    rateStart={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[4]
                    }
                    rateEnd={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[5]
                    }
                    experience={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[11]
                    }
                    logo={selectedWorker && selectedWorker.logo}
                    phone={
                      selectedWorker &&
                      selectedWorker.listingInfo &&
                      selectedWorker.listingInfo[12]
                    }
                    refresh={true}
                  />
                )}
              </>
            ) : (
              auth.currentUser && (
                <p className={styles.saved__listings__error}>
                  You have not bookmarked any listings yet
                </p>
              )
            )}
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default SavedListings
