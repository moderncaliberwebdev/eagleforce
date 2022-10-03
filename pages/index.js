import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../Components/Layout'
import styles from '../styles/Home.module.scss'

export default function Home() {
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
        <main>
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
                <input type='text' placeholder='Job title, trade, or company' />
                <select required>
                  <option value='' disabled selected hidden>
                    Search for Worker or Employer
                  </option>
                  <option value='Worker'>Worker</option>
                  <option value='Employer'>Employer</option>
                </select>
              </div>
              <button>Search</button>
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
                  src='/images/home/blue-graphic.png'
                  width={751}
                  height={570}
                  objectFit='cover'
                />
              </div>
            </div>
            <div className={styles.bestfit__workers}>
              <div className={styles.bestfit__workers__graphic_red}>
                <Image
                  src='/images/home/red-graphic.png'
                  width={751}
                  height={597}
                  objectFit='cover'
                />
              </div>
              <div className={styles.bestfit__workers__desc_red}>
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
                <div className={styles.bestfit__workers__desc_red__logos}>
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
          </section>
        </main>
      </Layout>
    </div>
  )
}
