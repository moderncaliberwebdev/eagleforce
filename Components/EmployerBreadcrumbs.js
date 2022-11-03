import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/WorkerBreadcrumbs.module.scss'
import RedBreadcrumb from './RedBreadcrumb'

function EmployerBreadcrumbs() {
  const router = useRouter()
  return (
    <div className={styles.breadcrumbs}>
      <ul>
        <RedBreadcrumb
          path='/post/employer'
          currentPath={router.pathname}
          text='Pick Listing Plan'
          borderClass={'first'}
        />
        <RedBreadcrumb
          path='/post/employer/create-listing'
          currentPath={router.pathname}
          text='Create Listing'
        />
        <RedBreadcrumb
          path='/post/employer/preview-listing'
          currentPath={router.pathname}
          text='Preview Listing'
        />
        <RedBreadcrumb
          path='/post/employer/purchase-listing'
          currentPath={router.pathname}
          text='Purchase Listing'
          borderClass={'last'}
        />
      </ul>
    </div>
  )
}

export default EmployerBreadcrumbs
