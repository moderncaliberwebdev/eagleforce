import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/WorkerBreadcrumbs.module.scss'
import BlueBreadcrumb from './BlueBreadcrumb'

function WorkerBreadcrumbs() {
  const router = useRouter()
  return (
    <div className={styles.breadcrumbs}>
      <ul>
        <BlueBreadcrumb
          path='/post/worker'
          currentPath={router.pathname}
          text='Pick Listing Plan'
          borderClass={'first'}
        />
        <BlueBreadcrumb
          path='/post/worker/create-listing'
          currentPath={router.pathname}
          text='Create Listing'
        />
        <BlueBreadcrumb
          path='/post/worker/preview-listing'
          currentPath={router.pathname}
          text='Preview Listing'
        />
        <BlueBreadcrumb
          path='/post/worker/purchase-listing'
          currentPath={router.pathname}
          text='Purchase Listing'
        />
        <BlueBreadcrumb
          path='/post/worker/verify-listing'
          currentPath={router.pathname}
          text='Verify Listing'
          borderClass={'last'}
        />
      </ul>
    </div>
  )
}

export default WorkerBreadcrumbs
