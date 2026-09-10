import postgres from 'postgres'
import type { DataProvider } from '../provider'
import type {
  Application,
  GeneratedDocument,
  JobSuggestion,
  SuggestionStatus,
  UserProfile,
} from '../types'

let _sql: postgres.Sql | null = null

function getSql(): postgres.Sql {
  if (!_sql) {
    const url = process.env.POSTGRES_URL
    if (!url) throw new Error('POSTGRES_URL is not set')
    _sql = postgres(url, { max: 1, idle_timeout: 20, connect_timeout: 10 })
  }
  return _sql
}

let schemaReady = false

async function ensureSchema(sql: postgres.Sql): Promise<void> {
  if (schemaReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS jf_applications (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS jf_suggestions (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS jf_profile (
      singleton BOOLEAN PRIMARY KEY DEFAULT TRUE,
      data JSONB NOT NULL,
      CONSTRAINT only_one_profile CHECK (singleton)
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS jf_documents (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      data JSONB NOT NULL
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS jf_instance (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`
  schemaReady = true
}

export class PostgresProvider implements DataProvider {
  private get sql() { return getSql() }

  private async init() { await ensureSchema(this.sql) }

  // ── Applications ─────────────────────────────────────────

  async listApplications(): Promise<Application[]> {
    await this.init()
    const rows = await this.sql`
      SELECT data FROM jf_applications ORDER BY (data->>'createdAt') DESC`
    return rows.map(r => r.data as Application)
  }

  async getApplication(id: string): Promise<Application | null> {
    await this.init()
    const rows = await this.sql`SELECT data FROM jf_applications WHERE id = ${id}`
    return (rows[0]?.data as Application) ?? null
  }

  async upsertApplication(app: Application): Promise<Application> {
    await this.init()
    await this.sql`
      INSERT INTO jf_applications (id, data) VALUES (${app.id}, ${this.sql.json(app as never)})
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
    return app
  }

  async deleteApplication(id: string): Promise<void> {
    await this.init()
    await this.sql`DELETE FROM jf_applications WHERE id = ${id}`
  }

  // ── Job suggestions ───────────────────────────────────────

  async listSuggestions(status?: SuggestionStatus): Promise<JobSuggestion[]> {
    await this.init()
    const rows = status
      ? await this.sql`SELECT data FROM jf_suggestions WHERE data->>'status' = ${status}`
      : await this.sql`SELECT data FROM jf_suggestions`
    return rows.map(r => r.data as JobSuggestion)
  }

  async saveSuggestion(s: JobSuggestion): Promise<JobSuggestion> {
    await this.init()
    await this.sql`
      INSERT INTO jf_suggestions (id, data) VALUES (${s.id}, ${this.sql.json(s as never)})
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
    return s
  }

  async dismissSuggestion(id: string): Promise<void> {
    await this.init()
    await this.sql`
      UPDATE jf_suggestions
      SET data = data || '{"status":"dismissed"}'::jsonb
      WHERE id = ${id}`
  }

  // ── User profile ──────────────────────────────────────────

  async getProfile(): Promise<UserProfile | null> {
    await this.init()
    const rows = await this.sql`SELECT data FROM jf_profile WHERE singleton = TRUE`
    return (rows[0]?.data as UserProfile) ?? null
  }

  async saveProfile(p: UserProfile): Promise<void> {
    await this.init()
    await this.sql`
      INSERT INTO jf_profile (singleton, data) VALUES (TRUE, ${this.sql.json(p as never)})
      ON CONFLICT (singleton) DO UPDATE SET data = EXCLUDED.data`
  }

  // ── Generated documents ───────────────────────────────────

  async saveDocument(doc: GeneratedDocument): Promise<GeneratedDocument> {
    await this.init()
    await this.sql`
      INSERT INTO jf_documents (id, application_id, data)
      VALUES (${doc.id}, ${doc.applicationId}, ${this.sql.json(doc as never)})
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
    return doc
  }

  async listDocuments(applicationId: string): Promise<GeneratedDocument[]> {
    await this.init()
    const rows = await this.sql`
      SELECT data FROM jf_documents WHERE application_id = ${applicationId}`
    return rows.map(r => r.data as GeneratedDocument)
  }

  // ── Instance config (trial) ───────────────────────────────

  async getTrialStart(): Promise<number | null> {
    await this.init()
    const rows = await this.sql`SELECT value FROM jf_instance WHERE key = 'trial_start'`
    if (!rows[0]) return null
    const n = parseInt(rows[0].value as string, 10)
    return isNaN(n) ? null : n
  }

  async setTrialStart(ts: number): Promise<void> {
    await this.init()
    await this.sql`
      INSERT INTO jf_instance (key, value) VALUES ('trial_start', ${String(ts)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`
  }
}
