import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Layout from '../../../Components/Layout'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'
import WorkerListingBlock from '../../../Components/WorkerListingBlock'
import WorkerListingSide from '../../../Components/WorkerListingSide'
import styles from '../../../styles/PreviewWorkerListing.module.scss'

function PreviewWorkerListing() {
  const [listingInfo, setListingInfo] = useState()
  const [workerNumber, setWorkerNumber] = useState(0)

  useEffect(() => {
    const functionOnLoad = () => {
      if (localStorage.getItem('listingInfo')) {
        const parsedInfo = JSON.parse(localStorage.getItem('listingInfo'))
        const number = JSON.parse(localStorage.getItem('workerNumber'))
        setListingInfo(parsedInfo)
        setWorkerNumber(number)

        let allFilled = true

        for (let i = 0; i < parsedInfo.length - 2; i++) {
          if (parsedInfo[i].length == 0) {
            allFilled = false
          }
        }
        if (allFilled == false) {
          window.location.href = '/post/worker'
        }
      } else window.location.href = '/post/worker'
    }
    functionOnLoad()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Preview Worker Listing | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='This is a preview of your worker listing. Switch back to Edit Listing if you  need to make changes'
        />
        <meta
          property='og:title'
          content='Preview Worker Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='This is a preview of your worker listing. Switch back to Edit Listing if you  need to make changes'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/worker/preview-listing'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.preview}>
          <h1>Preview Worker Listing</h1>
          <WorkerBreadcrumbs />
          <p className={styles.preview__paypal}>
            We use PayPal Checkout for purchases, but you do not need a PayPal
            account to use this service
          </p>
          <div className={styles.preview__buttons}>
            <Link href='/post/worker/create-listing' passHref>
              <a>Edit Listing</a>
            </Link>
            <Link
              href='https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-2TJ80196MP706632EMNFM53I'
              passHref
            >
              <a>Continue to PayPal</a>
            </Link>
          </div>
          <p className={styles.preview__notice}>
            This is a preview of your worker listing. Switch back to Edit
            Listing if you need to make changes
          </p>
          <div className={styles.preview__listing}>
            <WorkerListingBlock
              jobs={listingInfo && listingInfo[0]}
              number={workerNumber && workerNumber}
              type={listingInfo && listingInfo[2]}
              city={listingInfo && listingInfo[6]}
              employmentType={listingInfo && listingInfo[5]}
              skill={listingInfo && listingInfo[1]}
              summary={listingInfo && listingInfo[9]}
            />
            <WorkerListingSide
              jobs={listingInfo && listingInfo[0]}
              number={workerNumber && workerNumber}
              type={listingInfo && listingInfo[2]}
              city={listingInfo && listingInfo[6]}
              employmentType={listingInfo && listingInfo[5]}
              skill={listingInfo && listingInfo[1]}
              summary={listingInfo && listingInfo[9]}
              rateStart={listingInfo && listingInfo[3]}
              rateEnd={listingInfo && listingInfo[4]}
              experience={listingInfo && listingInfo[10]}
              highlights={listingInfo && listingInfo[11]}
            />
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default PreviewWorkerListing
