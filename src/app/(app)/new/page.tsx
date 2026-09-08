import { validateLicense } from '@/lib/license'
import { NewClient } from './client'

export default function NewPage() {
  const license = validateLicense(process.env.JOBFLOW_LICENSE_KEY)
  const tier = license.valid ? (license.tier ?? 'starter') : 'trial'
  return <NewClient tier={tier} />
}
