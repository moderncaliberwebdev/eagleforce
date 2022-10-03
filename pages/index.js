import Head from 'next/head'
import Image from 'next/image'
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
      <Layout>Content</Layout>
    </div>
  )
}
