'use server'

import { redirect } from 'next/navigation'
import { createDataProvider } from '@/lib/db'
import { parseCvToText } from '@/lib/parse-cv'
import type { UserProfile } from '@/lib/db/types'

export async function saveProfile(formData: FormData) {
  const db = createDataProvider()

  const now = new Date().toISOString()
  const existing = await db.getProfile()

  const jobSectionsRaw = parseInt(formData.get('jobSectionsCount') as string, 10)

  // Parse uploaded CV to plain text if a new file was provided
  const cvFile = formData.get('cv')
  let cvText: string | undefined = existing?.cvText
  let cvFileName: string | undefined = existing?.cvFileName
  if (cvFile instanceof File && cvFile.size > 0) {
    cvFileName = cvFile.name
    cvText = await parseCvToText(cvFile) || undefined
  }

  const profile: UserProfile = {
    targetRoles: splitComma(formData.get('targetRoles') as string),
    careerLevel: (formData.get('careerLevel') as string) ?? '',
    workArrangement: (formData.get('workArrangement') as string) ?? '',
    preferredIndustries: parseJsonArray(formData.get('preferredIndustries') as string),
    companyStages: parseJsonArray(formData.get('companyStages') as string),
    locations: splitComma(formData.get('locations') as string),
    jobSectionsCount: isNaN(jobSectionsRaw) ? 3 : Math.min(Math.max(jobSectionsRaw, 2), 6),
    linkedinAbout: (formData.get('linkedinAbout') as string) || undefined,
    linkedinSkills: (formData.get('linkedinSkills') as string) || undefined,
    cvFileName,
    cvText,
    photoFileName: (formData.get('photoFileName') as string) || existing?.photoFileName,
    linkedinPdfName: (formData.get('linkedinPdfName') as string) || existing?.linkedinPdfName,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await db.saveProfile(profile)
  redirect('/dashboard')
}

function splitComma(value: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}
