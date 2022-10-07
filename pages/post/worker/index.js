import Head from 'next/head'
import React from 'react'
import Layout from '../../../Components/Layout'
import PricingBlock from '../../../Components/PricingBlock'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'
import styles from '../../../styles/PostWorker.module.scss'

function PostWorker() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Post a Worker Listing | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Choose a plan tailored to your needs'
        />
        <meta
          property='og:title'
          content='Create Worker Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Choose a plan tailored to your needs'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/worker'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Post a Worker Listing</h1>
          <WorkerBreadcrumbs />
          <p className={styles.description}>
            If an employer is interested in your listing, they will contact us
            and we will notify you and give you their contact information. If
            you wish we will contact them for you up to 3 times to get the
            information that you request, such as job position and or more about
            pay etc. We will not give the employer your contact information such
            as name, phone number, etc. That will be up to you to do yourself at
            anytime. Your privacy is our first priority and is important to us
            as well.
          </p>
          <p className={styles.description}>
            Choose a plan tailored to your needs
          </p>
          <div className={styles.block_container}>
            <PricingBlock
              background='#fff'
              color='#000'
              backgroundLight='#E7EBEC'
              type='Standard'
              price='5'
              occurance='month'
              features={[
                'Standard listing posted on the job board for one month. Listing can be renewed',
                'Connect with amazing business owners and find your dream job',
              ]}
            />
            <PricingBlock
              background='#96a4c9'
              color='#18181b'
              backgroundLight='#b7c2dd'
              type='Featured'
              price='20'
              occurance='3 months'
              features={[
                'Featured listing posted at the very top of the job board for 3 months. Listing can be renewed',
                'Connect with amazing business owners and find your dream job',
              ]}
            />
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default PostWorker
