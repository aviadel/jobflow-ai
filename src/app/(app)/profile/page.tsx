import { createDataProvider } from '@/lib/db'
import { ProfileClient } from './client'

export const metadata = { title: 'Profile - JobFlow' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const db = createDataProvider()
  const profile = await db.getProfile()
  return <ProfileClient profile={profile} />
}
