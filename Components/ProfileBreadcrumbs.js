import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/WorkerBreadcrumbs.module.scss'
import BlueBreadcrumb from './BlueBreadcrumb'

function ProfileBreadcrumbs({ red }) {
  const router = useRouter()
  return (
    <div className={`${styles.breadcrumbs} ${styles.profile_breadcrumbs}`}>
      <ul>
        <BlueBreadcrumb
          path='/profile'
          ahref='/profile'
          currentPath={router.pathname}
          text='Settings'
          borderClass={'first'}
          red={red}
        />
        <BlueBreadcrumb
          path='/profile/saved'
          ahref='/profile/saved'
          currentPath={router.pathname}
          text='Saved Listings'
          red={red}
        />
        <BlueBreadcrumb
          path='/profile/listings'
          ahref='/profile/listings'
          currentPath={router.pathname}
          text='Your Listings'
          borderClass={'last'}
          red={red}
        />
      </ul>
    </div>
  )
}

export default ProfileBreadcrumbs
