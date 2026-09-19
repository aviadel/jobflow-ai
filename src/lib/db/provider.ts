import type {
  Application,
  GeneratedDocument,
  JobSuggestion,
  LicenseCache,
  SuggestionStatus,
  UserProfile,
} from './types'

export interface DataProvider {
  // Applications
  listApplications(): Promise<Application[]>
  getApplication(id: string): Promise<Application | null>
  upsertApplication(app: Application): Promise<Application>
  deleteApplication(id: string): Promise<void>

  // Job suggestions
  listSuggestions(status?: SuggestionStatus): Promise<JobSuggestion[]>
  saveSuggestion(s: JobSuggestion): Promise<JobSuggestion>
  dismissSuggestion(id: string): Promise<void>

  // User profile
  getProfile(): Promise<UserProfile | null>
  saveProfile(p: UserProfile): Promise<void>

  // Generated documents (CV / cover letter versions)
  saveDocument(doc: GeneratedDocument): Promise<GeneratedDocument>
  listDocuments(applicationId: string): Promise<GeneratedDocument[]>

  // Cached Lemon Squeezy license verdict
  getLicenseCache(): Promise<LicenseCache | null>
  setLicenseCache(c: LicenseCache): Promise<void>
}
