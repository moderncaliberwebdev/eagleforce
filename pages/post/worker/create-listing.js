import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Layout from '../../../Components/Layout'
import ListingHighlight from '../../../Components/ListingHighlight'
import ListingJob from '../../../Components/ListingJob'
import RichText from '../../../Components/RichText'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'
import styles from '../../../styles/CreateWorkerListing.module.scss'

function CreateListing() {
  const [jobs, setJobs] = useState(1)
  const [highlights, setHighlights] = useState(1)
  const [jobArray, setJobArray] = useState([])
  const [highlightArray, setHighlightArray] = useState([])
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
    const functionOnLoad = () => {
      if (localStorage.getItem('listingInfo')) {
        const parsedInfo = JSON.parse(localStorage.getItem('listingInfo'))

        setListingInfo(parsedInfo)

        setJobs(parsedInfo[10].length)
        setJobArray(parsedInfo[10])

        setHighlights(parsedInfo[11].length)
        setHighlightArray(parsedInfo[11])

        console.log(
          'listing state on load>>>>>',
          JSON.parse(localStorage.getItem('listingInfo'))
        )
      }
    }
    functionOnLoad()
  }, [])

  useEffect(() => {
    let listingInfoLength = 0
    listingInfo &&
      listingInfo.forEach((item) => (listingInfoLength += item.length))
    listingInfoLength > 0 &&
      localStorage.setItem('listingInfo', JSON.stringify(listingInfo))
    console.log('full listing after change >>>> ', listingInfo)
  }, [listingInfo])

  useEffect(() => {
    console.log('job array >>>', jobArray)
    const listingInfoFromStorage =
      localStorage.getItem('listingInfo') &&
      JSON.parse(localStorage.getItem('listingInfo'))
    const newState =
      listingInfoFromStorage &&
      listingInfoFromStorage.map((obj, index) => {
        if (index == 10 && jobArray.length > 0) {
          return jobArray
        }
        return obj
      })
    newState && setListingInfo(newState)
  }, [jobArray])

  useEffect(() => {
    const listingInfoFromStorage =
      localStorage.getItem('listingInfo') &&
      JSON.parse(localStorage.getItem('listingInfo'))
    const newState =
      listingInfoFromStorage &&
      listingInfoFromStorage.map((obj, index) => {
        if (index == 11 && highlightArray.length > 0) {
          return highlightArray
        }
        return obj
      })
    newState && setListingInfo(newState)
  }, [highlightArray])

  const addJob = () => {
    setJobs(jobs + 1)
    setJobArray([...jobArray, ['', '', '', '']])
  }

  const addHighlight = () => {
    setHighlights(highlights + 1)
    setHighlightArray([...highlightArray, ''])
  }

  const sendForm = () => {}

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
    console.log(
      'listing state at updateJobArray function >>>>',
      newState,
      index
    )
    if (index == 0) {
      const newJobArray = jobArray.map((obj, i) => {
        if (i == 0) {
          return newState
        }
        return obj
      })
      setJobArray(newJobArray)
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

  const updateHighlightArray = (newState, index) => {
    console.log(
      'listing state updateHighlightArray function >>>',
      newState,
      index
    )
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Worker Listing | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Fill in all the information regarding your desired position(s)'
        />
        <meta
          property='og:title'
          content='Create Worker Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Fill in all the information regarding your desired position(s)'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/worker/create-listing'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Create Worker Listing</h1>
          <WorkerBreadcrumbs />
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Position Details</h2>
              <p>
                Fill in all the information regarding your desired position(s)
              </p>
            </div>
            <div className={styles.create__inputs}>
              <div className={styles.create__inputs__input}>
                <label>Desired Position(s)</label>
                <input
                  type='text'
                  placeholder='Residential Plumber, Plumbing Technician, etc.'
                  onChange={(e) => updateListingInfo(0, e.target.value)}
                  value={listingInfo ? listingInfo[0] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>Skill Level</label>
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
                <label>Worker Type</label>
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
                <label>Desired Hourly Rate</label>
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
                <label>Desired Employment Type</label>
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
                <label>City</label>
                <input
                  type='text'
                  placeholder='Lancaster'
                  onChange={(e) => updateListingInfo(6, e.target.value)}
                  value={listingInfo ? listingInfo[6] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>State</label>
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
                  How did you find out about Eagle Force Employment Services?
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
                <label>Description</label>
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
              <button className={styles.preview} onClick={sendForm}>
                Preview Listing
              </button>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default CreateListing
