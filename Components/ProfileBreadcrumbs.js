import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/WorkerBreadcrumbs.module.scss'
import BlueBreadcrumb from './BlueBreadcrumb'

function ProfileBreadcrumbs() {
  const router = useRouter()
  return (
    <div className={`${styles.breadcrumbs} ${styles.profile_breadcrumbs}`}>
      <ul>
        <BlueBreadcrumb
          path='/profile'
          currentPath={router.pathname}
          text='Settings'
          borderClass={'first'}
        />
        <BlueBreadcrumb
          path='/profile/saved'
          currentPath={router.pathname}
          text='Saved Listings'
        />
        <BlueBreadcrumb
          path='/profile/listings'
          currentPath={router.pathname}
          text='Your Listings'
          borderClass={'last'}
        />
      </ul>
    </div>
  )
}

export default ProfileBreadcrumbs
