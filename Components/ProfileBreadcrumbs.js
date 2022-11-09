import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/WorkerBreadcrumbs.module.scss'
import BlueBreadcrumb from './BlueBreadcrumb'

function ProfileBreadcrumbs({ admin }) {
  const router = useRouter()
  return (
    <div className={`${styles.breadcrumbs} ${styles.profile_breadcrumbs}`}>
      <ul style={{ width: admin ? '90rem' : '50rem' }}>
        <BlueBreadcrumb
          path='/profile'
          ahref='/profile'
          currentPath={router.pathname}
          text='Settings'
          borderClass={'first'}
        />
        <BlueBreadcrumb
          path='/profile/saved'
          ahref='/profile/saved'
          currentPath={router.pathname}
          text='Bookmarked'
        />
        <BlueBreadcrumb
          path='/profile/listings'
          ahref='/profile/listings'
          currentPath={router.pathname}
          text='Listings'
          borderClass={admin ? '' : 'last'}
        />
        {admin && (
          <>
            <BlueBreadcrumb
              path='/profile/users'
              ahref='/profile/users'
              currentPath={router.pathname}
              text='Users'
            />
            <BlueBreadcrumb
              path='/profile/workers'
              ahref='/profile/workers'
              currentPath={router.pathname}
              text='Workers'
            />
            <BlueBreadcrumb
              path='/profile/employers'
              ahref='/profile/employers'
              currentPath={router.pathname}
              text='Employers'
              borderClass={'last'}
            />
          </>
        )}
      </ul>
    </div>
  )
}

export default ProfileBreadcrumbs
