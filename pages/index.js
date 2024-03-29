import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../Components/Layout'
import styles from '../styles/Home.module.scss'
import { useRouter } from 'next/router'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'
import { useEffect, useState } from 'react'
import Popup from '../Components/Popup'

export default function Home({}) {
  const auth = getAuth(app)

  const { query } = useRouter()

  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState('')
  const [error, setError] = useState('')
  const [openPopup, setOpenPopup] = useState(false)
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user.displayName.split(' - ')[0])
      }
    })
  }, [auth])

  useEffect(() => {
    if (query && query.signup && query.signup == 'new' && currentUser) {
      setOpenPopup(true)
    }
  }, [query, currentUser])

  const submit = () => {
    if (searchType == 'Employer') {
      window.location.href = `/employers?search=${search}&employmentType=&workerType=&location=&prox=&rateStart=&rateEnd=`
    } else if (searchType == 'Worker') {
      window.location.href = `/workers?search=${search}&skillLevel=&employmentType=&workerType=&location=&prox=`
    } else setError('Please fill in all fields before submitting')
  }

  const cancelCongrats = () => {
    setOpenPopup(false)
  }

  const nextCongrats = () => {
    window.location.href = `/post/${
      currentUser == 'Workers' ? 'employer' : 'worker'
    }`
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Find the most qualified employers and workers in Lancaster County at Eagle Force Employment Services. It’as as easy as typing in a job title and clicking search!'
        />
        <meta
          property='og:title'
          content='Home | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Find the most qualified employers and workers in Lancaster County at Eagle Force Employment Services. It’as as easy as typing in a job title and clicking search!'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.main}>
          <Popup
            question='Congragulations on creating an account!'
            desc='What would you like to do next?'
            answer={`Create ${
              currentUser == 'Workers' ? ' an Employer' : ' a Worker'
            } Listing`}
            no='Go to Home'
            cancel={cancelCongrats}
            next={nextCongrats}
            openPopup={openPopup}
            color={currentUser == 'Workers' ? 'red' : 'blue'}
            renew={true}
          />
          <section className={styles.hero}>
            <div className={styles.hero__left}>
              <h2>
                Employment services you can&apos;t find
                <span>anywhere else</span>
              </h2>
              <p>
                Find the most qualified employers and workers in Lancaster
                County at Eagle Force Employment Services. It&apos;as as easy as
                typing in a job title and clicking search!
              </p>
              <div className={styles.hero__left__inputs}>
                <input
                  type='text'
                  placeholder={
                    searchType == 'Employer'
                      ? 'Search by job title, trade, or company'
                      : 'Search by job title, trade, or worker number'
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  required
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value='' disabled selected hidden>
                    Search for Worker or Employer
                  </option>
                  <option value='Worker'>Worker</option>
                  <option value='Employer'>Employer</option>
                </select>
              </div>
              <button onClick={submit}>Search</button>
              <p className={styles.hero__left__inputs__error}>{error}</p>
            </div>
            <div className={styles.hero__right}>
              <div className={styles.hero__right__top}>
                <figure className={styles.hero__right__top__card}>
                  <h3>Workers find an Employer</h3>
                  <p>
                    Connect with amazing business owners and find your dream job
                  </p>
                  <Link href='/employers' passHref>
                    <a>See all Employers</a>
                  </Link>
                </figure>
                <div className={styles.hero__right__top__verse}>
                  “Whatever you do, work at it with all your heart, as working
                  for the Lord, not for human masters.” - Colossians 3:23
                </div>
              </div>
              <div className={styles.hero__right__bottom}>
                <div className={styles.hero__right__bottom__verse}>
                  “But as for you, be strong and do not give up, for your work
                  will be rewarded.” - 2 Chronicles 15:7
                </div>
                <figure className={styles.hero__right__bottom__card}>
                  <h3>Employers find a Worker</h3>
                  <p>
                    Connect with job seekers and find the best candidates for
                    your company
                  </p>
                  <Link href='/workers' passHref>
                    <a>See all Workers</a>
                  </Link>
                </figure>
              </div>
            </div>
          </section>
          <section className={styles.subhero}>
            <p className={styles.subhero__dedicated}>
              Dedicated service to the plain community for over 30 years
            </p>
            <div className={styles.subhero__marquee}>
              <div
                className={styles.subhero__marquee__inner}
                aria-hidden='true'
              >
                <span>Crew Driver</span>
                <span>Construction Worker</span>
                <span>Carpenter</span>
                <span>Welder</span>
                <span>Mechanic</span>
                <span>Technician</span>
                <span>Landscape Technician</span>
                <span>Painter</span>
                <span>Brick Mason</span>
                <span>Crew Driver</span>
                <span>Construction Worker</span>
                <span>Carpenter</span>
                <span>Welder</span>
                <span>Mechanic</span>
                <span>Technician</span>
                <span>Landscape Technician</span>
                <span>Painter</span>
                <span>Brick Mason</span>
                <span>Crew Driver</span>
                <span>Construction Worker</span>
                <span>Carpenter</span>
                <span>Welder</span>
                <span>Mechanic</span>
                <span>Technician</span>
                <span>Landscape Technician</span>
                <span>Painter</span>
                <span>Brick Mason</span>
              </div>
            </div>
          </section>
          <section className={styles.bestfit}>
            <h2>find the best fit for you</h2>
            <div className={styles.bestfit__workers}>
              <div className={styles.bestfit__workers__desc}>
                <div className={styles.bestfit__workers__desc__triangle}>
                  <img src='/images/home/triangle-blue.png' />
                </div>
                <div className={styles.bestfit__workers__desc__graphic}>
                  <img src='/images/home/mobile-blue-2.png' />
                </div>
                <h3>
                  Find qualified workers that meet your standards and exceed
                  your expectations
                </h3>
                <p>
                  Lancaster is filled with hard workers in the plain community
                  including plumbers, crew drivers, and construction workers.
                  Find them all here at Eagle Force Employment Services!
                </p>
                <Link href='/workers'>
                  <a>Employers find a worker</a>
                </Link>
              </div>
              <div className={styles.bestfit__workers__graphic}>
                <Image
                  src='/images/home/blue-graphic-3.png'
                  width={1000}
                  height={800}
                  objectFit='fixed'
                />
              </div>
            </div>
            <div className={styles.bestfit__workers}>
              <div className={styles.bestfit__workers__graphic_red}>
                <Image
                  src='/images/home/red-graphic-3.png'
                  width={1000}
                  height={800}
                  objectFit='fixed'
                />
              </div>
              <div className={styles.bestfit__workers__desc_red}>
                <div className={styles.bestfit__workers__desc_red__triangle}>
                  <img src='/images/home/triangle-red.png' />
                </div>
                <div className={styles.bestfit__workers__desc_red__graphic}>
                  <img src='/images/home/mobile-red-2.png' />
                </div>
                <div className={styles.bestfit__workers__desc_red__container}>
                  <h3>
                    Find amazing employers who offer fantastic benefits and a
                    wholesome work environment
                  </h3>
                  <p>
                    Find the best employers Lancaster County has to offer! Eagle
                    Force Employment Serviecs has partnered with many local
                    business to help you find your dream job.
                  </p>
                  <Link href='/employers'>
                    <a>Workers find an employer</a>
                  </Link>
                  <div
                    className={
                      styles.bestfit__workers__desc_red__container__logos
                    }
                  >
                    <Image
                      src='/images/home/company-logo.png'
                      width={50}
                      height={50}
                    />
                    <Image
                      src='/images/home/company-logo.png'
                      width={50}
                      height={50}
                    />
                    <Image
                      src='/images/home/company-logo.png'
                      width={50}
                      height={50}
                    />
                    <Image
                      src='/images/home/company-logo.png'
                      width={50}
                      height={50}
                    />
                    <Image
                      src='/images/home/company-logo.png'
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.listings}>
            <h2>post your listing and reach top candidates</h2>
            <div className={styles.listings__section}>
              <div className={styles.listings__section__left}>
                <h3>
                  Post a listing as a job seeker to allow companies to find you
                </h3>
                <p>
                  Posting a listing as a job seeker allows you to stand out and
                  be seen by more companies. Pick a listing plan, fill out the
                  form, post it, and you are well on your way to finding an
                  amazing company to work for!
                </p>
                <div className={styles.listings__section__left__listing}>
                  <Image
                    src='/images/home/blue-check.png'
                    width={25}
                    height={25}
                    objectFit='contain'
                  />
                  <p>Simple listing plans</p>
                </div>
                <div className={styles.listings__section__left__listing}>
                  <Image
                    src='/images/home/blue-check.png'
                    width={25}
                    height={25}
                    objectFit='contain'
                  />
                  <p>Easy to use listing builder</p>
                </div>
                <div className={styles.listings__section__left__listing}>
                  <Image
                    src='/images/home/blue-check.png'
                    width={25}
                    height={25}
                    objectFit='contain'
                  />
                  <p>Viewed by quality companies</p>
                </div>
                <Link href='/post/worker'>
                  <a>Post a Worker Listing</a>
                </Link>
              </div>
              <div className={styles.listings__section__right}>
                <Image
                  src='/images/home/blue-listing.png'
                  width={549}
                  height={471}
                  objectFit='cover'
                />
              </div>
            </div>
            <div className={`${styles.listings__section} ${styles.reverse}`}>
              <div className={styles.listings__section__left}>
                <h3>
                  Post an employer listing to have job seekers reach out to you
                </h3>
                <p>
                  Posting a listing as a employer allows job seekers to find
                  your company. Pick a listing plan, fill out the form, post it,
                  and you are well on your way to finding amazing new employees!
                </p>
                <div className={styles.listings__section__left__listing}>
                  <Image
                    src='/images/home/red-check.png'
                    width={25}
                    height={25}
                    objectFit='contain'
                  />
                  <p>Simple listing plans</p>
                </div>
                <div className={styles.listings__section__left__listing}>
                  <Image
                    src='/images/home/red-check.png'
                    width={25}
                    height={25}
                    objectFit='contain'
                  />
                  <p>Easy to use listing builder</p>
                </div>
                <div className={styles.listings__section__left__listing}>
                  <Image
                    src='/images/home/red-check.png'
                    width={25}
                    height={25}
                    objectFit='contain'
                  />
                  <p>Viewed by quality job seekers</p>
                </div>
                <Link href='/post/employer'>
                  <a>Post an Employer Listing</a>
                </Link>
              </div>
              <div className={styles.listings__section__right}>
                <Image
                  src='/images/home/red-listing.png'
                  width={549}
                  height={471}
                  objectFit='cover'
                />
              </div>
            </div>
          </section>
          <section className={styles.signup}>
            <div className={styles.signup__left}>
              <h2>
                Employment services for the plain community in Lancaster, PA
              </h2>
              <p>
                Let Eagle Force Employment Services jump start your journey with
                your employment venture.
              </p>
              <Link href='/sign-up'>
                <a>Sign Up!</a>
              </Link>
            </div>
            <div className={styles.signup__right}>
              <div className={styles.signup__right__item}>
                <Image
                  src='/images/home/Plumbing.png'
                  width={50}
                  height={50}
                  objectFit='contain'
                />
                <p>Plumbing Technician Jobs</p>
              </div>
              <div className={styles.signup__right__item}>
                <Image
                  src='/images/home/Hacksaw.png'
                  width={50}
                  height={50}
                  objectFit='contain'
                />
                <p>Residential Jobs in Construction</p>
              </div>
              <div className={styles.signup__right__item}>
                <Image
                  src='/images/home/Truck.png'
                  width={50}
                  height={50}
                  objectFit='contain'
                />
                <p>Crew Drivers</p>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}
