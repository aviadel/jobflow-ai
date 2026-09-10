import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import type { DataProvider } from '../provider'
import type {
  Application,
  GeneratedDocument,
  JobSuggestion,
  SuggestionStatus,
  UserProfile,
} from '../types'

const DEFAULT_DIR = join('/tmp', 'jobflow')

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(join(filePath, '..'))
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export class JsonProvider implements DataProvider {
  private dir: string

  constructor(dir = DEFAULT_DIR) {
    this.dir = dir
  }

  // ── Applications ─────────────────────────────────────────

  async listApplications(): Promise<Application[]> {
    return readJson(join(this.dir, 'applications.json'), [])
  }

  async getApplication(id: string): Promise<Application | null> {
    const apps = await this.listApplications()
    return apps.find((a) => a.id === id) ?? null
  }

  async upsertApplication(app: Application): Promise<Application> {
    const apps = await this.listApplications()
    const idx = apps.findIndex((a) => a.id === app.id)
    if (idx !== -1) {
      apps[idx] = app
    } else {
      apps.push(app)
    }
    await writeJson(join(this.dir, 'applications.json'), apps)
    return app
  }

  async deleteApplication(id: string): Promise<void> {
    const apps = await this.listApplications()
    await writeJson(
      join(this.dir, 'applications.json'),
      apps.filter((a) => a.id !== id),
    )
  }

  // ── Job suggestions ───────────────────────────────────────

  async listSuggestions(status?: SuggestionStatus): Promise<JobSuggestion[]> {
    const all = await readJson<JobSuggestion[]>(join(this.dir, 'suggestions.json'), [])
    return status ? all.filter((s) => s.status === status) : all
  }

  async saveSuggestion(s: JobSuggestion): Promise<JobSuggestion> {
    const all = await this.listSuggestions()
    const idx = all.findIndex((x) => x.id === s.id)
    if (idx !== -1) {
      all[idx] = s
    } else {
      all.push(s)
    }
    await writeJson(join(this.dir, 'suggestions.json'), all)
    return s
  }

  async dismissSuggestion(id: string): Promise<void> {
    const all = await this.listSuggestions()
    const item = all.find((s) => s.id === id)
    if (item) {
      item.status = 'dismissed'
      await writeJson(join(this.dir, 'suggestions.json'), all)
    }
  }

  // ── User profile ──────────────────────────────────────────

  async getProfile(): Promise<UserProfile | null> {
    await ensureDir(this.dir)
    return readJson<UserProfile | null>(join(this.dir, 'profile.json'), null)
  }

  async saveProfile(p: UserProfile): Promise<void> {
    await ensureDir(this.dir)
    await writeJson(join(this.dir, 'profile.json'), p)
  }

  // ── Generated documents ───────────────────────────────────

  async saveDocument(doc: GeneratedDocument): Promise<GeneratedDocument> {
    const all = await this.listDocuments(doc.applicationId)
    const idx = all.findIndex((d) => d.id === doc.id)
    if (idx !== -1) {
      all[idx] = doc
    } else {
      all.push(doc)
    }
    await writeJson(join(this.dir, `docs_${doc.applicationId}.json`), all)
    return doc
  }

  async listDocuments(applicationId: string): Promise<GeneratedDocument[]> {
    return readJson<GeneratedDocument[]>(
      join(this.dir, `docs_${applicationId}.json`),
      [],
    )
  }

  // ── Instance config (trial) ───────────────────────────────

  async getTrialStart(): Promise<number | null> {
    const data = await readJson<{ trialStart?: number }>(join(this.dir, 'instance.json'), {})
    return data.trialStart ?? null
  }

  async setTrialStart(ts: number): Promise<void> {
    await writeJson(join(this.dir, 'instance.json'), { trialStart: ts })
  }
}
