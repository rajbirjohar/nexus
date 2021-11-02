import React from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/organizations.module.css'
import Link from 'next/link'

// Component: OrganizationCard({
// organizer,
// organizationName,
// organizationDescription,
// organizationId,})
// Params: organizer, organizationName, organizationDescription, organizationId
// Purpose: Display each organization as an individual "card"
// See ListOrganizations component

export default function OrganizationCard({
  organizer,
  organizationName,
  organizationDescription,
  organizationId,
}) {
  const { data: session } = useSession()

  const deleteOrganization = async (event) => {
    if (session) {
      const res = await fetch('/api/organizations/orgdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationData: organizationId }),
      })
      await res.json()
      // wait for status from orgdelete endpoint to post success toast
      if (res.status === 200) {
        toast.success('Deleted organization.')
      } else {
        toast.error('Uh oh. Something went wrong.')
      }
    }
  }

  return (
    // Link is used to route each card to a dynamic page
    // listing all details for that specific organization
    <Link href={`/organizations/${organizationName}`} passHref>
      <div className={styles.card}>
        <p className={styles.organizationName}>{organizationName}</p>
        <h4 className={styles.organizationDescription}>
          {organizationDescription}
        </h4>
        <span className={styles.organizer}>{organizer}</span>
        <br />
        {/* Checks if user is logged in and the user name matches organizer
        Thus, only the logged in user can access the delete function */}
        {session && session.user.name === organizer && (
          <>
            {/* <button className={styles.modify}>Modify</button> */}
            <button onClick={deleteOrganization} className={styles.delete}>
              Delete
            </button>
          </>
        )}
      </div>
    </Link>
  )
}
