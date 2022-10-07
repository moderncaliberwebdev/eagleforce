import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react'
import Layout from '../../../Components/Layout'
import ListingHighlight from '../../../Components/ListingHighlight'
import ListingJob from '../../../Components/ListingJob'
import RichText from '../../../Components/RichText'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'
import styles from '../../../styles/CreateWorkerListing.module.scss'

function CreateListing() {
  const [jobs, setJobs] = useState(1)
  const [highlights, setHighlights] = useState(1)

  const addJob = () => {
    setJobs(jobs + 1)
  }

  const addHighlight = () => {
    setHighlights(highlights + 1)
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
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>Skill Level</label>
                <select required>
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
                <select required>
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
                  <input type='text' placeholder='20' />
                  <p className={styles.create__inputs__input__rate__to}>to</p>
                  <p>$</p>
                  <input type='text' placeholder='20' />
                </div>
              </div>
              <div className={styles.create__inputs__input}>
                <label>Desired Employment Type</label>
                <select required>
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
                <input type='text' placeholder='Lancaster' />
              </div>
              <div className={styles.create__inputs__input}>
                <label>State</label>
                <select required>
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
                <input type='text' />
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
                <RichText />
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
                <ListingJob key={i} />
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
                <ListingHighlight key={i} />
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
              <button className={styles.preview}>Preview Listing</button>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default CreateListing
