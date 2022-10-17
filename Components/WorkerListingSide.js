import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import styles from '../styles/WorkerListingSide.module.scss'

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
}) {
  const [descOverflow, setDescOverflow] = useState(false)
  const [overflowOpen, setOverflowOpen] = useState(false)

  useEffect(() => {
    setDescOverflow(isOverflown(document.getElementById('desc')))
  }, [])

  const isOverflown = (el) => {
    var curOverflow = el.style.overflow

    if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden'

    var isOverflowing =
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight

    el.style.overflow = curOverflow

    return isOverflowing
  }

  const readMore = () => {
    if (overflowOpen) {
      const desc = document.getElementById('desc')
      desc.style.maxHeight = '10rem'
      setOverflowOpen(false)
    } else {
      const desc = document.getElementById('desc')
      desc.style.maxHeight = 'none'
      setOverflowOpen(true)
    }
  }

  return (
    <div className={styles.side}>
      <div className={styles.side__title}>
        <Image
          src='/images/post/worker.png'
          width='100'
          height='100'
          objectFit='fixed'
        />
        <p className={styles.side__title__number}>Worker #{number}</p>
        <p className={styles.side__title__type}>
          {type == 'Both' ? 'Worker & Driver' : `${type} Only`}
        </p>
      </div>
      <div className={styles.side__scroll}>
        <div className={styles.side__scroll__book}>
          <div className={styles.side__scroll__book__left}>
            <p className={styles.side__scroll__book__left__jobs}>{jobs}</p>
            <p className={styles.side__scroll__book__left__location}>
              {city}, PA
            </p>
          </div>
          <div className={styles.side__scroll__book__right}>
            <Image
              src='/images/post/book-grey.png'
              width='30'
              height='60'
              objectFit='fixed'
            />
          </div>
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
          {experience && experience[0][0].length > 0 && (
            <p className={styles.side__scroll__desc__title}>Work Experience</p>
          )}
          <div className={styles.side__scroll__desc__jobs}>
            {experience &&
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
                    <span dangerouslySetInnerHTML={{ __html: job[3] }}></span>
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
        <p className={styles.side__scroll__desc__overflow} onClick={readMore}>
          {descOverflow && (overflowOpen ? 'Read Less' : 'Read More...')}
        </p>
      </div>
      <button className={styles.side__contact}>Contact Worker</button>
    </div>
  )
}

export default WorkerListingSide
