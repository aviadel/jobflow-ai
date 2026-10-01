export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: string
  jobTitle: string
  company: string
  location?: string
  url?: string
  jdRaw?: string
  status: ApplicationStatus
  salaryMin?: number
  salaryMax?: number
  currency?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  name?: string
  email?: string
  phone?: string
  city?: string             // city + country, e.g. "Tel Aviv, Israel"
  cvText?: string           // parsed plain text from the uploaded CV
  targetRoles: string[]
  careerLevel: string
  workArrangement: string
  preferredIndustries: string[]
  companyStages: string[]
  locations: string[]
  jobSectionsCount?: number  // how many job sections to generate (2-6, default 3)
  cvWithPhoto?: boolean      // whether to include photo in generated CV
  cvFileName?: string
  photoData?: string         // base64 data URL of the downscaled profile photo (~200x200)
  photoFileName?: string
  linkedinAbout?: string
  linkedinSkills?: string
  linkedinPdfName?: string
  createdAt: string
  updatedAt: string
}

export type SuggestionStatus = 'new' | 'saved' | 'dismissed'

export interface JobSuggestion {
  id: string
  jobTitle: string
  company: string
  location?: string
  url: string
  snippet?: string
  status: SuggestionStatus
  createdAt: string
}

export type DocumentType = 'cv' | 'cover_letter'

export interface GeneratedDocument {
  id: string
  applicationId: string
  type: DocumentType
  content: string
  version: number
  createdAt: string
}
