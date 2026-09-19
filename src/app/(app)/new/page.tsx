import { resolveLicense } from '@/lib/license-server'
import { createDataProvider } from '@/lib/db'
import { NewClient } from './client'

export default async function NewPage() {
  // Unlicensed requests never reach here - proxy.ts redirects them to /setup.
  const [license, profile] = await Promise.all([
    resolveLicense(),
    createDataProvider().getProfile(),
  ])
  return (
    <NewClient
      tier={license.tier ?? 'starter'}
      profileName={profile?.name}
      profileEmail={profile?.email}
      profilePhone={profile?.phone}
      profileCity={profile?.city}
      photoData={profile?.photoData}
      cvWithPhoto={profile?.cvWithPhoto ?? true}
    />
  )
}
