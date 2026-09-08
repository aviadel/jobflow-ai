import { createDataProvider } from '@/lib/db'
import { TrackerClient } from './client'

export const metadata = { title: 'Tracker — JobFlow' }

export default async function TrackerPage() {
  const db = createDataProvider()
  const apps = await db.listApplications()
  // newest first
  const sorted = [...apps].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return <TrackerClient initialApps={sorted} />
}
