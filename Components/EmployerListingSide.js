import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'

import styles from '../styles/EmployerListingSide.module.scss'
import axios from 'axios'
import EmployerContactPopup from './EmployerContactPopup'
import Link from 'next/link'

import { useMediaQuery } from 'react-responsive'

const auth = getAuth()

function EmployerListingSide({
  job,
  number,
  email,
  company,
  website,
  type,
  city,
  employmentType,
  description,
  rateStart,
  rateEnd,
  experience,
  refresh,
  createObjectURL,
  logo,
  preview,
  phone,
  hideFullListing,
}) {
  const [currentUser, setCurrentUser] = useState()
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [error, setError] = useState('')
  const [contactEmployer, setContactEmployer] = useState(false)
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
        setBookmarks(data.data)
      }
    })
  }, [auth])

  useEffect(() => {
    setError('')
    setBookmarked(false)

    if (bookmarks && bookmarks.length > 0) {
      bookmarks.forEach((bm) => {
        if (bm.split(' ')[0] == 'Employer' && bm.split('#')[1] == number) {
          setBookmarked(true)
        }
      })
    }
  }, [job, bookmarks])

  const bookmarkListing = async () => {
    if (currentUser) {
      if (bookmarked) {
        setBookmarked(false)
        const filteredBookmarks = bookmarks.filter(
          (bm) => bm.split(' ')[0] == 'Employer' && bm.split('#')[1] != number
        )
        setBookmarks(filteredBookmarks)
        const config = {
          headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
        }
        const data = await axios.put(
          `/api/user/removebookmark`,
          {
            email: currentUser.email,
            number: `Employer #${number}`,
          },
          config
        )
        data && refresh && window.location.reload()
      } else {
        setBookmarked(true)
        setBookmarks([...bookmarks, `Employer #${number}`])
        const config = {
          headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
        }
        const data = await axios.put(
          `/api/user/bookmark`,
          {
            email: currentUser.email,
            number: `Employer #${number}`,
          },
          config
        )
      }
    } else {
      setError('Must be signed in to bookmark listings')
    }
  }

  const cancel = () => {
    setContactEmployer(false)
  }

  return (
    <div
      className={styles.side}
      style={{
        display:
          isSmallScreenState && !job
            ? 'none'
            : isSmallScreenState && job
            ? 'flex'
            : 'flex',
      }}
    >
      <EmployerContactPopup
        openPopup={contactEmployer}
        cancel={cancel}
        email={email}
      />
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
            logo && logo.length > 0
              ? `https://eagleforce-avatar.s3.amazonaws.com/${logo}`
              : createObjectURL
              ? createObjectURL
              : '/images/post/factory-red-larg.png'
          }
          width='100'
          height='100'
          objectFit='contain'
        />
        <p className={styles.side__title__number}>{company}</p>
        <p className={styles.side__title__type}>
          {job
            ? type == 'Both'
              ? 'Worker & Driver'
              : `${type} Only`
            : 'Select a listing to see their full info'}
        </p>
        <p className={styles.side__title__phone}>{phone}</p>
      </div>
      {job && job.length > 0 && (
        <>
          <div className={styles.side__scroll}>
            <div className={styles.side__scroll__book}>
              <div className={styles.side__scroll__book__left}>
                <p className={styles.side__scroll__book__left__jobs}>{job}</p>
                <p className={styles.side__scroll__book__left__location}>
                  {city}, PA
                </p>
                {website.length > 0 && (
                  <a
                    href={`https://${website.replace(/(^\w+:|^)\/\//, '')}`}
                    target='_blank'
                  >
                    Visit our Website
                  </a>
                )}
              </div>
              <div
                className={styles.side__scroll__book__right}
                onClick={bookmarkListing}
              >
                {bookmarked ? (
                  <Image
                    src='/images/post/book-red.png'
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
                  Estimated Hourly Rate
                </p>
                <p className={styles.side__scroll__details__detail__desc}>
                  ${rateStart} - ${rateEnd}
                </p>
              </div>
              <div className={styles.side__scroll__details__detail}>
                <p className={styles.side__scroll__details__detail__title}>
                  Employment Type
                </p>
                <p className={styles.side__scroll__details__detail__desc}>
                  {employmentType}
                </p>
              </div>
            </div>
            <div className={styles.side__scroll__desc} id='desc'>
              <p className={styles.side__scroll__desc__title}>
                Job Description
              </p>
              <p
                className={styles.side__scroll__desc__desc}
                dangerouslySetInnerHTML={{ __html: description }}
              ></p>
              <p className={styles.side__scroll__desc__title}>Qualifications</p>
              <p
                className={styles.side__scroll__desc__desc}
                dangerouslySetInnerHTML={{ __html: experience }}
              ></p>
            </div>
          </div>
          <div className={styles.side__contact}>
            <button onClick={() => !preview && setContactEmployer(true)}>
              Contact Employer
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default EmployerListingSide
