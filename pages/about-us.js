import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/About.module.scss'

function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About Us | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='We are a Lancaster County Business with over 32 years experience working with the plain community.'
        />
        <meta
          property='og:title'
          content='About Us | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='We are a Lancaster County Business with over 32 years experience working with the plain community'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/about-us'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>About Us</h1>
          <p>
            We are a <span>Lancaster County Business</span> with over 32 years
            experience working with the plain community
          </p>
          <section>
            <div className={styles.left}>
              <Image
                src='/images/about/about-graphic.png'
                width={549}
                height={596}
                objectFit='cover'
              />
            </div>
            <div className={styles.right}>
              <p>
                Our relationship with our neighbors is based on years of
                understanding, trust and respect for each others way of life. We
                make friends in the community all the time and try to learn from
                each other. Often we get questions from people that are curious
                about life here in Lancaster County. We understand the curiosity
                and interest in the Lancaster, PA way of life and enjoy sharing
                our experiences. We believe everyone working together in this
                country can accomplish anything. We hope to impress upon you the
                best work ethics and values our local business owners and
                workers have to offer.
              </p>
              <h2>
                Thank you for your interest in Eagle Force Employment Services℠
              </h2>
              <div className={styles.right__buttons}>
                <Link href='/sign-up' passHref>
                  <a className={styles.right__buttons__primary}>
                    Create an Account with Us
                  </a>
                </Link>
                <Link href='/contact' passHref>
                  <a className={styles.right__buttons__secondary}>Contact Us</a>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

export default About
