import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../Components/Layout'
import styles from '../styles/Contact.module.scss'

import { getAuth } from 'firebase/auth'
import app from '../firebase/clientApp'
import axios from 'axios'

export default function Home({}) {
  const auth = getAuth(app)
  const user = auth.currentUser

  const formSubmit = async () => {
    const firstname = document.getElementById('form-firstname')
    const lastname = document.getElementById('form-lastname')
    const email = document.getElementById('form-email')
    const phone = document.getElementById('form-phone')
    const message = document.getElementById('form-message')
    const formResponse = document.getElementById('form-response')
    const formSuccess = document.getElementById('form-success')

    const inputs = [firstname, lastname, email, phone, message]

    const { data } = await axios.get(
      `/api/mail?firstname=${firstname.value}&lastname=${lastname.value}&email=${email.value}&phone=${phone.value}&message=${message.value}`
    )

    if (data.formResponse) {
      formResponse.textContent = data.formResponse
    } else {
      formSuccess.textContent = 'Message Sent'
      formResponse.textContent = ''
      inputs.forEach((input) => {
        input.value = ''
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Contact | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Any questions or remarks? Just send us a message!'
        />
        <meta
          property='og:title'
          content='Contact | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Any questions or remarks? Just send us a message!'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <div className={styles.contact}>
          <h1 className={styles.contact__h1}>Contact</h1>
          <p className={styles.contact__p}>
            Any questions or remarks? Just write us a message!
          </p>
          <p className={styles.contact__p}>
            Or give us a call at
            <a href='tel:717-826-3754'>717-826-3754</a>
          </p>
          <form className={styles.contact__form}>
            <div className={styles.contact__form__input_short}>
              <p>First Name</p>
              <input type='text' id='form-firstname' />
            </div>
            <div className={styles.contact__form__input_short}>
              <p>Last Name</p>
              <input type='text' id='form-lastname' />
            </div>
            <div className={styles.contact__form__input_short}>
              <p>Email</p>
              <input type='text' id='form-email' />
            </div>
            <div className={styles.contact__form__input_short}>
              <p className={styles.contact__form__input_short__p}>
                Phone Number
              </p>
              <input type='text' id='form-phone' />
            </div>
            <div className={styles.contact__form__input_long}>
              <p>Message</p>
              <input type='text' id='form-message' />
            </div>
            <div
              id='form-response'
              className={styles.contact__form__response}
            ></div>
            <div
              id='form-success'
              className={styles.contact__form__success}
            ></div>
          </form>
          <div className={styles.contact__buttons}>
            <button
              className={styles.orange_button}
              onClick={() => formSubmit()}
            >
              Send Message
            </button>
          </div>
        </div>
      </Layout>
    </div>
  )
}
