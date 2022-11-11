import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'

import styles from '../styles/WorkerListingSide.module.scss'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import ContactPopup from './ContactPopup'

const auth = getAuth()

function WorkerListingSide({
  jobs,
  number,
  type,
  city,
  employmentType,
  skill,
  summary,
  rateStart,
  rateEnd,
  experience,
  highlights,
  refresh,
  preview,
  hideFullListing,
}) {
  const [currentUser, setCurrentUser] = useState()
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [error, setError] = useState('')
  const [contactWorker, setContactWorker] = useState(false)
  const [isSmallScreenState, setIsSmallScreenState] = useState(false)

  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' })

  useEffect(() => {
    setIsSmallScreenState(isSmallScreen)
  }, [isSmallScreen])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(
          `/api/user/bookmark?email=${user.email}`,
          config
        )
        console.log(data.data)
        setBookmarks(data.data)
      }
    })
  }, [auth])

  useEffect(() => {
    setError('')
    setBookmarked(false)

    if (bookmarks && bookmarks.length > 0) {
      bookmarks.forEach((bm) => {
        if (bm.split(' ')[0] == 'Worker' && bm.split('#')[1] == number) {
          console.log('set bookmarked true')
          setBookmarked(true)
        }
      })
    }
  }, [jobs, bookmarks])

  useEffect(() => {}, [bookmarks])

  const bookmarkListing = async () => {
    if (currentUser) {
      if (bookmarked) {
        setBookmarked(false)

        const filteredBookmarks = bookmarks.filter(
          (bm) => bm.split(' ')[0] == 'Worker' && bm.split('#')[1] != number
        )
        setBookmarks(filteredBookmarks)

        const config = {
          headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
        }
        const data = await axios.put(
          `/api/user/removebookmark`,
          {
            email: currentUser.email,
            number: `Worker #${number}`,
          },
          config
        )

        data && refresh && window.location.reload()
      } else {
        setBookmarked(true)
        setBookmarks([...bookmarks, `Worker #${number}`])
        const config = {
          headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
        }
        const data = await axios.put(
          `/api/user/bookmark`,
          {
            email: currentUser.email,
            number: `Worker #${number}`,
          },
          config
        )
      }
    } else {
      setError('Must be signed in to bookmark listings')
    }
  }

  const cancel = () => {
    setContactWorker(false)
  }

  return (
    <div
      className={styles.side}
      style={{
        display:
          isSmallScreenState && !jobs
            ? 'none'
            : isSmallScreenState && jobs
            ? 'flex'
            : 'flex',
      }}
    >
      <ContactPopup openPopup={contactWorker} cancel={cancel} worker={number} />
      {isSmallScreenState && (
        <img
          className={styles.side__arrow}
          src='/images/layout/arrow.png'
          alt='arrow'
          onClick={hideFullListing}
        />
      )}
      <div className={styles.side__title}>
        <Image
          src={
            jobs
              ? type == 'Both'
                ? '/images/post/worker-driver.png'
                : type == 'Worker'
                ? '/images/post/worker.png'
                : '/images/post/driver.png'
              : '/images/post/worker.png'
          }
          width='100'
          height='100'
          objectFit='fixed'
        />
        <p className={styles.side__title__number}>
          {jobs && `Worker #${number}`}
        </p>
        <p className={styles.side__title__type}>
          {jobs
            ? type == 'Both'
              ? 'Worker & Driver'
              : `${type} Only`
            : 'Select a listing to see their full info'}
        </p>
      </div>
      {jobs && jobs.length > 0 && (
        <>
          <div className={styles.side__scroll}>
            <div className={styles.side__scroll__book}>
              <div className={styles.side__scroll__book__left}>
                <p className={styles.side__scroll__book__left__jobs}>{jobs}</p>
                <p className={styles.side__scroll__book__left__location}>
                  {city}, PA
                </p>
              </div>
              <div
                className={styles.side__scroll__book__right}
                onClick={bookmarkListing}
              >
                {bookmarked ? (
                  <Image
                    src='/images/post/book-blue.png'
                    width='30'
                    height='60'
                    layout='fixed'
                  />
                ) : (
                  <Image
                    src='/images/post/book-grey.png'
                    width='30'
                    height='60'
                    layout='fixed'
                  />
                )}
              </div>
              {error && error.length > 0 && (
                <p className={styles.side__scroll__book__error}>{error}</p>
              )}
            </div>
            <div className={styles.side__scroll__details}>
              <p className={styles.side__scroll__details__title}>Details</p>
              <div className={styles.side__scroll__details__detail}>
                <p className={styles.side__scroll__details__detail__title}>
                  Desired Hourly Rate
                </p>
                <p className={styles.side__scroll__details__detail__desc}>
                  ${rateStart} - ${rateEnd}
                </p>
              </div>
              <div className={styles.side__scroll__details__detail}>
                <p className={styles.side__scroll__details__detail__title}>
                  Desired Employment Type
                </p>
                <p className={styles.side__scroll__details__detail__desc}>
                  {employmentType}
                </p>
              </div>
              <div className={styles.side__scroll__details__detail}>
                <p className={styles.side__scroll__details__detail__title}>
                  Skill Level
                </p>
                <p className={styles.side__scroll__details__detail__desc}>
                  {skill}
                </p>
              </div>
            </div>
            <div className={styles.side__scroll__desc} id='desc'>
              <p className={styles.side__scroll__desc__title}>Description</p>
              <p
                className={styles.side__scroll__desc__desc}
                dangerouslySetInnerHTML={{ __html: summary }}
              ></p>
              {experience && experience[0] && experience[0][0].length > 0 && (
                <p className={styles.side__scroll__desc__title}>
                  Work Experience
                </p>
              )}
              <div className={styles.side__scroll__desc__jobs}>
                {experience &&
                  experience[0] &&
                  experience[0][0].length > 0 &&
                  experience.map((job) => (
                    <div
                      key={job[0]}
                      className={styles.side__scroll__desc__jobs__job}
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
              {highlights && highlights[0] && highlights[0].length > 0 && (
                <p className={styles.side__scroll__desc__title}>Highlights</p>
              )}
              <div className={styles.side__scroll__desc__highlights}>
                {highlights &&
                  highlights.map((highlight) => (
                    <p dangerouslySetInnerHTML={{ __html: highlight }}></p>
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.side__contact}>
            <button onClick={() => !preview && setContactWorker(true)}>
              Contact Worker
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default WorkerListingSide
