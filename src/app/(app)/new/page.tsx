import { resolveLicense } from '@/lib/license-server'
import { NewClient } from './client'

export default async function NewPage() {
  // Unlicensed requests never reach here - proxy.ts redirects them to /setup.
  const license = await resolveLicense()
  return <NewClient tier={license.tier ?? 'starter'} />
}
