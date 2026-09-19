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

  const cvFile = formData.get('cv')
  let cvText: string | undefined = existing?.cvText
  let cvFileName: string | undefined = existing?.cvFileName
  if (cvFile instanceof File && cvFile.size > 0) {
    cvFileName = cvFile.name
    cvText = await parseCvToText(cvFile) || undefined
  }

  // Photo: client sends a base64 data URL in 'photoData' after downscaling
  const photoDataRaw = formData.get('photoData') as string | null
  const photoData = photoDataRaw && photoDataRaw.startsWith('data:image/')
    ? photoDataRaw
    : existing?.photoData

  const photoFileName = (formData.get('photoFileName') as string) || existing?.photoFileName

  const cvWithPhotoRaw = formData.get('cvWithPhoto') as string | null
  const cvWithPhoto = cvWithPhotoRaw !== null
    ? cvWithPhotoRaw === 'true'
    : (existing?.cvWithPhoto ?? true)

  const profile: UserProfile = {
    name: (formData.get('name') as string) || existing?.name,
    email: (formData.get('email') as string) || undefined,
    phone: (formData.get('phone') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    targetRoles: splitComma(formData.get('targetRoles') as string),
    careerLevel: (formData.get('careerLevel') as string) ?? '',
    workArrangement: (formData.get('workArrangement') as string) ?? '',
    preferredIndustries: parseJsonArray(formData.get('preferredIndustries') as string),
    companyStages: parseJsonArray(formData.get('companyStages') as string),
    locations: splitComma(formData.get('locations') as string),
    jobSectionsCount: isNaN(jobSectionsRaw) ? 3 : Math.min(Math.max(jobSectionsRaw, 2), 6),
    cvWithPhoto,
    linkedinAbout: (formData.get('linkedinAbout') as string) || undefined,
    linkedinSkills: (formData.get('linkedinSkills') as string) || undefined,
    cvFileName,
    cvText,
    photoData,
    photoFileName,
    linkedinPdfName: (formData.get('linkedinPdfName') as string) || existing?.linkedinPdfName,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await db.saveProfile(profile)
  redirect('/dashboard')
}

export async function updateProfile(formData: FormData) {
  const db = createDataProvider()

  const now = new Date().toISOString()
  const existing = await db.getProfile()

  const jobSectionsRaw = parseInt(formData.get('jobSectionsCount') as string, 10)

  const cvFile = formData.get('cv')
  let cvText: string | undefined = existing?.cvText
  let cvFileName: string | undefined = existing?.cvFileName
  if (cvFile instanceof File && cvFile.size > 0) {
    cvFileName = cvFile.name
    cvText = await parseCvToText(cvFile) || undefined
  }

  const photoDataRaw = formData.get('photoData') as string | null
  const photoData = photoDataRaw && photoDataRaw.startsWith('data:image/')
    ? photoDataRaw
    : existing?.photoData

  const photoFileName = (formData.get('photoFileName') as string) || existing?.photoFileName

  const cvWithPhotoRaw = formData.get('cvWithPhoto') as string | null
  const cvWithPhoto = cvWithPhotoRaw !== null
    ? cvWithPhotoRaw === 'true'
    : (existing?.cvWithPhoto ?? true)

  const profile: UserProfile = {
    ...existing,
    name: (formData.get('name') as string) || existing?.name,
    email: (formData.get('email') as string) || undefined,
    phone: (formData.get('phone') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    targetRoles: splitComma(formData.get('targetRoles') as string) || existing?.targetRoles || [],
    careerLevel: (formData.get('careerLevel') as string) || existing?.careerLevel || '',
    workArrangement: (formData.get('workArrangement') as string) || existing?.workArrangement || '',
    preferredIndustries: parseJsonArray(formData.get('preferredIndustries') as string).length > 0
      ? parseJsonArray(formData.get('preferredIndustries') as string)
      : (existing?.preferredIndustries ?? []),
    companyStages: parseJsonArray(formData.get('companyStages') as string).length > 0
      ? parseJsonArray(formData.get('companyStages') as string)
      : (existing?.companyStages ?? []),
    locations: splitComma(formData.get('locations') as string) || existing?.locations || [],
    jobSectionsCount: isNaN(jobSectionsRaw) ? (existing?.jobSectionsCount ?? 3) : Math.min(Math.max(jobSectionsRaw, 2), 6),
    cvWithPhoto,
    linkedinAbout: (formData.get('linkedinAbout') as string) || existing?.linkedinAbout,
    linkedinSkills: (formData.get('linkedinSkills') as string) || existing?.linkedinSkills,
    cvFileName,
    cvText,
    photoData,
    photoFileName,
    linkedinPdfName: (formData.get('linkedinPdfName') as string) || existing?.linkedinPdfName,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await db.saveProfile(profile)
  redirect('/profile')
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
