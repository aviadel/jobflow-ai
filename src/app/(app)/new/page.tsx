import { createDataProvider } from '@/lib/db'
import { NewClient } from './client'

export default async function NewPage() {
  const profile = await createDataProvider().getProfile()
  return (
    <NewClient
      profileName={profile?.name}
      profileEmail={profile?.email}
      profilePhone={profile?.phone}
      profileCity={profile?.city}
      photoData={profile?.photoData}
      cvWithPhoto={profile?.cvWithPhoto ?? true}
    />
  )
}
