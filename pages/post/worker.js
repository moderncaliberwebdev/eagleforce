import Head from 'next/head'
import React from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/PostWorker.module.scss'

function PostWorker() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Terms and Conditions | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='This statement should be read in it’s entirety before using the website. We are fully committed to protecting your privacy.'
        />
        <meta
          property='og:title'
          content='Terms and Conditions | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='This statement should be read in it’s entirety before using the website. We are fully committed to protecting your privacy.'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/terms-and-conditions'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Post a Worker Listing</h1>
        </main>
      </Layout>
    </div>
  )
}

export default PostWorker
