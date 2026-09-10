import { resolveLicense } from '@/lib/license-server'
import { NewClient } from './client'

export default async function NewPage() {
  const license = await resolveLicense()
  const tier = license.valid ? (license.tier ?? 'starter') : 'trial'
  return <NewClient tier={tier} />
}
