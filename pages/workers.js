import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../Components/Layout'
import styles from '../styles/Workers.module.scss'
import axios from 'axios'

import { useEffect, useState } from 'react'
import WorkerListingBlock from '../Components/WorkerListingBlock'
import FeaturedWorkerListingBlock from '../Components/FeaturedWorkerListingBlock'
import WorkerListingSide from '../Components/WorkerListingSide'

export default function Workers({ data, error }) {
  const [listings, setListings] = useState({})
  const [selectedWorker, setSelectedWorker] = useState([])

  useEffect(() => {
    data && setListings(data)
  }, [data])

  useEffect(() => {
    console.log(listings && listings.featuredWorkers)
  }, [listings])

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
            <div className={styles.workers__filter__location}>
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
          </div>
          <div className={styles.workers__listings}>
            <input
              type='text'
              className={styles.workers__listings__search}
              placeholder='Job title, trade, or company'
            />
            <p className={styles.workers__listings__notice}>
              All verified workers have been screened by the site administrator
            </p>
            <div className={styles.workers__listings__display}>
              {listings &&
                listings.featuredWorkers &&
                listings.featuredWorkers.map((worker) => (
                  <FeaturedWorkerListingBlock
                    jobs={worker.listingInfo[0]}
                    number={worker.workerNumber}
                    type={worker.listingInfo[2]}
                    city={worker.listingInfo[6]}
                    employmentType={worker.listingInfo[5]}
                    skill={worker.listingInfo[1]}
                    summary={worker.listingInfo[9]}
                  />
                ))}
              {listings &&
                listings.standardWorkers &&
                listings.standardWorkers.map((worker) => (
                  <WorkerListingBlock
                    jobs={worker.listingInfo[0]}
                    number={worker.workerNumber}
                    type={worker.listingInfo[2]}
                    city={worker.listingInfo[6]}
                    employmentType={worker.listingInfo[5]}
                    skill={worker.listingInfo[1]}
                    summary={worker.listingInfo[9]}
                  />
                ))}
            </div>
          </div>

          <WorkerListingSide />
        </main>
      </Layout>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/worker/get-workers`
    )
    console.log(data)

    return {
      props: { data: JSON.parse(JSON.stringify(data.data)) },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { error: JSON.parse(JSON.stringify(e)) },
    }
  }
}
