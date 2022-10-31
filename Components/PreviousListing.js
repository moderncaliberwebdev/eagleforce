import React, { useState, useEffect } from 'react'
import styles from '../styles/PreviousListing.module.scss'

import axios from 'axios'
import qs from 'qs'
import Popup from './Popup'

function PreviousListing({ listing, currentUser }) {
  const [open, setOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [jobs, setJobs] = useState(1)
  const [jobArray, setJobArray] = useState([])
  const [highlights, setHighlights] = useState(1)
  const [highlightArray, setHighlightArray] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [listingInfo, setListingInfo] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    [],
    [],
  ])

  useEffect(() => {
    setListingInfo(listing.listingInfo)
    setJobs(
      listing.listingInfo[10].length && listing.listingInfo[10].length > 0
        ? listing.listingInfo[10].length
        : 1
    )
    setJobArray(listing.listingInfo[10])

    setHighlights(
      listing.listingInfo[11].length && listing.listingInfo[11].length > 0
        ? listing.listingInfo[11].length
        : 1
    )
    setHighlightArray(listing.listingInfo[11])
  }, [listing])

  useEffect(() => {
    const newState =
      listingInfo &&
      listingInfo.map((obj, index) => {
        if (index == 10 && jobArray.length > 0) {
          return jobArray
        }
        return obj
      })
    newState && setListingInfo(newState)
  }, [jobArray])

  useEffect(() => {
    const newState =
      listingInfo &&
      listingInfo.map((obj, index) => {
        if (index == 11 && highlightArray.length > 0) {
          return highlightArray
        }
        return obj
      })
    newState && setListingInfo(newState)
  }, [highlightArray])

  const updateListingInfo = (element, value) => {
    const newState = listingInfo.map((obj, index) => {
      if (index == element) {
        return value
      }
      return obj
    })
    setListingInfo(newState)
  }

  const updateJobArray = (newState, index) => {
    if (index == 0) {
      if (jobArray.length == 0) {
        setJobArray([newState])
      } else {
        const newJobArray = jobArray.map((obj, i) => {
          if (i == 0) {
            return newState
          }
          return obj
        })
        setJobArray(newJobArray)
      }
    } else {
      if (jobArray.length >= index + 1) {
        const newJobArray = jobArray.map((obj, i) => {
          if (i == index) {
            return newState
          }
          return obj
        })
        setJobArray(newJobArray)
      } else {
        setJobArray([...jobArray, newState])
      }
    }
  }
  const addJob = () => {
    setJobs(jobs + 1)
    setJobArray([...jobArray, ['', '', '', '']])
  }

  const removeJob = (job) => {
    setJobArray(jobArray.filter((item) => item != job))
    setJobs(jobs - 1)
  }

  const updateHighlightArray = (newState, index) => {
    if (index == 0) {
      setHighlightArray([newState])
    } else {
      if (highlightArray.length >= index + 1) {
        const newhighlightArray = highlightArray.map((obj, i) => {
          if (i == index) {
            return newState
          }
          return obj
        })
        setHighlightArray(newhighlightArray)
      } else {
        setHighlightArray([...highlightArray, newState])
      }
    }
  }

  const addHighlight = () => {
    setHighlights(highlights + 1)
    setHighlightArray([...highlightArray, ''])
  }

  const removeHighlight = (highlight) => {
    setHighlightArray(highlightArray.filter((item) => item != highlight))
    setHighlights(highlights - 1)
  }

  const sendForm = async () => {
    let allFilled = true

    for (let i = 0; i < listingInfo.length - 2; i++) {
      if (listingInfo[i].length == 0) {
        allFilled = false
      }
    }

    if (!allFilled) {
      setErrorMsg('Please Fill in All Required Fields')
    } else {
      setErrorMsg('')
      const config = {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      }
      const data = await axios.put(
        '/api/worker/update-listing',
        {
          email: currentUser.email,
          listingInfo,
          number: listing.workerNumber,
        },
        config
      )

      data && window.location.reload()
    }
  }

  const cancelDelete = () => {
    setOpenPopup(false)
  }

  const renewListing = async () => {
    //get paypal token
    const basicAuth = `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET}`
    const qsData = qs.stringify({
      grant_type: 'client_credentials',
    })

    const tokenConfig = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(basicAuth).toString('base64')}`,
      },
    }

    const paypalToken = await axios.post(
      'https://api-m.paypal.com/v1/oauth2/token',
      qsData,
      tokenConfig
    )

    //return listing to database
    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    const data = await axios.post(
      '/api/user/renew-listing',
      {
        email: currentUser.email,
        number: listing.workerNumber,
      },
      config
    )
    console.log(data)

    // renew listing on paypal
    if (data.data.newListing) {
      const activateConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paypalToken.data.access_token}`,
        },
      }
      const activateData = await axios.post(
        `https://api-m.paypal.com/v1/billing/subscriptions/${data.data.newListing.orderDetails.id}/activate`,
        {},
        activateConfig
      )
      activateData && window.location.reload()
    }
  }

  return (
    <div className={styles.blocks__block} key={listing._id}>
      <Popup
        question='Are you sure you want to reopen your listing?'
        desc='Your subscription will be renewed at at the same price as when you cancelled it'
        answer='Continue'
        no='Cancel'
        cancel={cancelDelete}
        next={renewListing}
        openPopup={openPopup}
        renew={true}
      />
      <div className={styles.blocks__block__info}>
        <h2>
          Worker #{listing.workerNumber} - {listing.listingInfo[0]}
        </h2>
        <button onClick={() => setOpenPopup(true)}>Renew Listing</button>
        <img
          src='/images/layout/arrow.png'
          alt='Dropdown Arrow'
          onClick={() => setOpen(!open)}
          style={{ transform: open && 'rotate(180deg)' }}
        />
      </div>
      {open && (
        <div className={styles.blocks__block__desc}>
          <div className={styles.blocks__block__desc__top}>
            <p>
              {listing.listingInfo[6]}, {listing.listingInfo[7]}
            </p>
          </div>
          <div className={styles.blocks__block__desc__details}>
            <h2>Details</h2>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Desired Hourly Rate</h3>
              <p>
                ${listing.listingInfo[3]} - ${listing.listingInfo[3]}
              </p>
            </div>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Desired Employment Type</h3>
              <p>{listing.listingInfo[5]}</p>
            </div>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Skill Level</h3>
              <p>{listing.listingInfo[1]}</p>
            </div>
          </div>
          <div className={styles.blocks__block__desc__desc}>
            <h2>Description</h2>
            <p
              className={styles.blocks__block__desc__desc__summary}
              dangerouslySetInnerHTML={{ __html: listing.listingInfo[9] }}
            ></p>
            {listing.listingInfo[10] &&
              listing.listingInfo[10][0] &&
              listing.listingInfo[10][0].length > 0 && (
                <div className={styles.blocks__block__desc__desc__jobs}>
                  <h2>Work Experience</h2>
                  {listing.listingInfo[10].map((job) => (
                    <div
                      key={job[0]}
                      className={styles.blocks__block__desc__desc__jobs__job}
                    >
                      <p>
                        Job Title: <span>{job[0]}</span>
                      </p>
                      <p>
                        Company Name: <span>{job[1]}</span>
                      </p>
                      <p>
                        Time Period: <span>{job[2]}</span>
                      </p>
                      <p>Responsibilities:</p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{ __html: job[3] }}
                        ></span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            {listing.listingInfo[11] && listing.listingInfo[11].length > 0 && (
              <div className={styles.blocks__block__desc__desc__jobs}>
                <h2>Highlights</h2>
                {listing.listingInfo[11].map((highlight) => (
                  <p dangerouslySetInnerHTML={{ __html: highlight }}></p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PreviousListing
