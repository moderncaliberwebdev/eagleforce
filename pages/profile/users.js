import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/YourListings.module.scss'

import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'
import PreviousListing from '../../Components/PreviousListing'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'

const auth = getAuth()

function ProfileUsers() {
  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [users, setUsers] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user)
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(`/api/user/all-users?admin=true`, config)

        console.log(data)
        data && setLoading(false)
        setUsers(JSON.parse(JSON.stringify(data.data)))

        const userData = await axios.get(
          `/api/user?email=${user.email}`,
          config
        )
        setUserFromDB(userData.data.user)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  return (
    <div className={styles.container}>
      <Head>
        <title> Profile | Eagle Force Employment Services</title>
        <meta
          property='og:title'
          content='Profile | Eagle Force Employment Services'
        />

        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/profile/users'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>All Users</h1>
          <ProfileBreadcrumbs admin={userFromDB && userFromDB.admin} />
          <div className={styles.blocks}>
            {loading && (
              <p className={styles.blocks__loading}>Loading Users...</p>
            )}
            {users &&
              users.length > 0 &&
              users.map((user) => (
                <div className={styles.blocks__block} key={user._id}>
                  <div className={styles.blocks__block__info}>
                    <h3>
                      {user.name.split(' - ')[1]} - <span>{user.email}</span>
                      <span>{user.phone}</span>
                    </h3>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default ProfileUsers
