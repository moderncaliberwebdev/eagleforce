import React, { useState, useEffect } from 'react'
import styles from '../styles/YourListings.module.scss'

import RichText from '../Components/RichText'
import Image from 'next/image'
import ListingJob from './ListingJob'
import ListingHighlight from './ListingHighlight'
import axios from 'axios'
import Link from 'next/link'
import Popup from './Popup'

function YourListing({ listing, currentUser }) {
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
    console.log('log listing object>>> ', listing)
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
    console.log('job array state >>>', listingInfo, newState)
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
    console.log('highlight array state >>>', listingInfo, newState)
  }, [highlightArray])

  const updateListingInfo = (element, value) => {
    const newState = listingInfo.map((obj, index) => {
      if (index == element) {
        return value
      }
      return obj
    })
    setListingInfo(newState)
    console.log('update listing info state >>>', listingInfo, newState)
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

  const closeListing = async () => {
    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    const data = await axios.put(
      '/api/user/close-listing',
      {
        email: currentUser.email,
        number: listing.workerNumber,
      },
      config
    )

    data && console.log(data)
  }

  return (
    <div className={styles.blocks__block} key={listing._id}>
      <Popup
        question='Are you sure you want to close your listing?'
        desc='Your subscription will be cancelled. This action can be undone by going to the Previous Listings tab in the Listings section of your profile.'
        answer='Continue'
        no='Cancel'
        cancel={cancelDelete}
        next={closeListing}
        openPopup={openPopup}
      />
      <div className={styles.blocks__block__info}>
        <h2>
          Worker #{listing.workerNumber} - {listing.listingInfo[0]}
        </h2>
        {!listing.verified && (
          <Link href='/post/worker/verify-listing' passHref>
            <a>Verify Listing</a>
          </Link>
        )}
        <button onClick={() => setOpenPopup(true)}>Close Listing</button>
        <img
          src='/images/layout/arrow.png'
          alt='Dropdown Arrow'
          onClick={() => setOpen(!open)}
          style={{ transform: open && 'rotate(180deg)' }}
        />
      </div>
      {open && (
        <div className={styles.blocks__block__create}>
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Position Details</h2>
              <p>
                Fill in all the information regarding your desired position(s)
              </p>
            </div>
            <div className={styles.create__inputs}>
              <div className={styles.create__inputs__input}>
                <label>Desired Position(s) **</label>
                <input
                  type='text'
                  placeholder='Residential Plumber, Plumbing Technician, etc.'
                  onChange={(e) => updateListingInfo(0, e.target.value)}
                  value={listingInfo ? listingInfo[0] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>Skill Level **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(1, e.target.value)}
                  value={listingInfo ? listingInfo[1] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick Skill Type
                  </option>
                  <option value='Beginner'>Beginner</option>
                  <option value='Advanced'>Advanced</option>
                  <option value='Expert Foreman Grade'>
                    Expert Foreman Grade
                  </option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>Worker Type **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(2, e.target.value)}
                  value={listingInfo ? listingInfo[2] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick Worker Type
                  </option>
                  <option value='Worker'>Worker</option>
                  <option value='Crew Driver'>Crew Driver</option>
                  <option value='Both'>Both</option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>Desired Hourly Rate **</label>
                <div className={styles.create__inputs__input__rate}>
                  <p>$</p>
                  <input
                    type='text'
                    placeholder='20'
                    onChange={(e) => updateListingInfo(3, e.target.value)}
                    value={listingInfo ? listingInfo[3] : ''}
                  />
                  <p className={styles.create__inputs__input__rate__to}>to</p>
                  <p>$</p>
                  <input
                    type='text'
                    placeholder='30'
                    onChange={(e) => updateListingInfo(4, e.target.value)}
                    value={listingInfo ? listingInfo[4] : ''}
                  />
                </div>
              </div>
              <div className={styles.create__inputs__input}>
                <label>Desired Employment Type **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(5, e.target.value)}
                  value={listingInfo ? listingInfo[5] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick Employment Type
                  </option>
                  <option value='Full Time'>Full Time</option>
                  <option value='Part Time'>Part Time</option>
                  <option value='Both Full Time & Part Time'>
                    Both Full Time & Part Time
                  </option>
                  <option value='Contract'>Contract</option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>City **</label>
                <input
                  type='text'
                  placeholder='Lancaster'
                  onChange={(e) => updateListingInfo(6, e.target.value)}
                  value={listingInfo ? listingInfo[6] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>State **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(7, e.target.value)}
                  value={listingInfo ? listingInfo[7] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick State
                  </option>
                  <option value='Pennsylvania'>Pennsylvania</option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>
                  How did you find out about Eagle Force Employment Services? **
                </label>
                <input
                  type='text'
                  onChange={(e) => updateListingInfo(8, e.target.value)}
                  value={listingInfo ? listingInfo[8] : ''}
                />
              </div>
            </div>
          </div>
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Personal Summary</h2>
              <p>Summarize strong character traits, skills, experience, etc.</p>
            </div>
            <div className={styles.create__inputs}>
              <div className={styles.create__inputs__input}>
                <label>Description **</label>
                <RichText
                  updateListingInfo={updateListingInfo}
                  textHTML={listingInfo ? listingInfo[9] : ''}
                />
              </div>
            </div>
          </div>
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Qualifications</h2>
              <p>
                Highlight your qualifications for the position(s) you&apos;re
                trying to obtain
              </p>
            </div>
            <div className={styles.create__inputs}>
              <h3>Work Experience</h3>
              {[...Array(jobs)].map((e, i) => (
                <ListingJob
                  key={i}
                  updateJobArray={updateJobArray}
                  index={i}
                  valuesFromState={listingInfo[10]}
                  removeJob={removeJob}
                />
              ))}
              <button
                onClick={addJob}
                className={styles.create__inputs__button}
              >
                Add Another Job
                <div>
                  <Image
                    src='/images/post/blue-plus.png'
                    width={25}
                    height={25}
                    objectFit={'fixed'}
                  />
                </div>
              </button>
              <h3>Highlights (Education, Special Skills, etc.)</h3>
              {[...Array(highlights)].map((e, i) => (
                <ListingHighlight
                  key={i}
                  updateHighlightArray={updateHighlightArray}
                  index={i}
                  valuesFromState={listingInfo[11]}
                  removeHighlight={removeHighlight}
                />
              ))}
              <button
                onClick={addHighlight}
                style={{ marginTop: '4rem' }}
                className={styles.create__inputs__button}
              >
                Add Another Highlight
                <div>
                  <Image
                    src='/images/post/blue-plus.png'
                    width={25}
                    height={25}
                    objectFit={'fixed'}
                  />
                </div>
              </button>
              <p className={styles.create__inputs__disclaimer}>
                ** - Required Field
              </p>
              <button
                className={styles.create__inputs__preview}
                onClick={sendForm}
              >
                Update Listing
              </button>
              <p className={styles.create__inputs__error}>
                {errorMsg && errorMsg.length > 0 && errorMsg}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YourListing
