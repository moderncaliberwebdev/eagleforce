import Head from 'next/head'
import React from 'react'
import EmployerBreadcrumbs from '../../../Components/EmployerBreadcrumbs'
import Layout from '../../../Components/Layout'
import PricingBlock from '../../../Components/PricingBlock'
import styles from '../../../styles/PostEmployer.module.scss'

function PostWorker() {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          Post an Employer Listing | Eagle Force Employment Services
        </title>
        <meta
          name='description'
          content='Choose a plan tailored to your needs'
        />
        <meta
          property='og:title'
          content='Create Employer Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Choose a plan tailored to your needs'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/employer'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Post an Employer Listing</h1>
          <EmployerBreadcrumbs />
          <p className={styles.description}>
            <span>Choose a plan tailored to your needs</span>
          </p>
          <div className={styles.block_container}>
            <PricingBlock
              background='#fff'
              color='#000'
              backgroundLight='#E7EBEC'
              type='Standard'
              user='Employer'
              price='100'
              occurance='6 months'
              features={[
                'Standard listing posted on the job board for 6 months. Listing can be renewed ',
                'Connect with job seekers and find the best candidates for your company',
              ]}
            />
            <PricingBlock
              background='#C9A596'
              color='#281F1F'
              backgroundLight='#DDC0B7'
              type='Featured'
              user='Employer'
              price='150'
              occurance='6 months'
              features={[
                'Featured listing posted at the very top of the job board for 6 months. Listing can be renewed',
                'Connect with job seekers and find the best candidates for your company',
              ]}
            />
          </div>
          <p className={styles.error} id='error'>
            To Post a Worker Listing, Sign Up For an Eagle Force Employment
            Services Account or Log In to Your Account if You Have One
          </p>
        </main>
      </Layout>
    </div>
  )
}

export default PostWorker
