import { createSign } from 'crypto'
import type { DataProvider } from '../provider'
import type {
  Application,
  ApplicationStatus,
  GeneratedDocument,
  JobSuggestion,
  SuggestionStatus,
  UserProfile,
} from '../types'

// ── Environment ───────────────────────────────────────────────────────────────
// Required env vars:
//   GOOGLE_SHEETS_SPREADSHEET_ID  — the spreadsheet ID from the URL
//   GOOGLE_SERVICE_ACCOUNT_JSON   — full service account key JSON as a string

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'

const APP_HEADERS = [
  'id', 'jobTitle', 'company', 'location', 'url', 'jdRaw',
  'status', 'salaryMin', 'salaryMax', 'currency', 'notes', 'createdAt', 'updatedAt',
]

// ── Token cache ───────────────────────────────────────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null

function parseCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set')
  return JSON.parse(raw) as {
    client_email: string
    private_key: string
    token_uri: string
  }
}

function makeJwt(clientEmail: string, privateKey: string, tokenUri: string): string {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: SCOPES,
    aud: tokenUri,
    exp: now + 3600,
    iat: now,
  })).toString('base64url')
  const signing = `${header}.${payload}`
  const sign = createSign('RSA-SHA256')
  sign.update(signing)
  const sig = sign.sign(privateKey, 'base64url')
  return `${signing}.${sig}`
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value
  }
  const { client_email, private_key, token_uri } = parseCredentials()
  const jwt = makeJwt(client_email, private_key, token_uri)
  const res = await fetch(token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json() as { access_token: string; expires_in: number }
  if (!data.access_token) throw new Error('Failed to get Google access token')
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cachedToken.value
}

// ── Sheets helpers ────────────────────────────────────────────────────────────

async function sheetsGet(path: string): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${SHEETS_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function sheetsPost(path: string, body: unknown): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${SHEETS_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function sheetsPut(path: string, body: unknown): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${SHEETS_BASE}${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function cell(v: unknown): string {
  if (v === undefined || v === null) return ''
  return String(v)
}

// ── Ensure sheets exist ───────────────────────────────────────────────────────

async function ensureSheets(spreadsheetId: string): Promise<void> {
  const res = await sheetsGet(`/${spreadsheetId}?fields=sheets.properties.title`)
  const meta = await res.json() as { sheets: { properties: { title: string } }[] }
  const existing = new Set(meta.sheets.map(s => s.properties.title))
  const toAdd: string[] = []
  for (const name of ['applications', 'profile']) {
    if (!existing.has(name)) toAdd.push(name)
  }
  if (toAdd.length === 0) return
  await sheetsPost(`/${spreadsheetId}:batchUpdate`, {
    requests: toAdd.map(title => ({ addSheet: { properties: { title } } })),
  })
  // Write headers for applications sheet
  if (toAdd.includes('applications')) {
    await sheetsPut(
      `/${spreadsheetId}/values/applications!A1?valueInputOption=RAW`,
      { values: [APP_HEADERS] },
    )
  }
}

// ── Row <-> Application ───────────────────────────────────────────────────────

function rowToApp(row: string[]): Application {
  const [id, jobTitle, company, location, url, jdRaw, status, salaryMin, salaryMax, currency, notes, createdAt, updatedAt] = row
  return {
    id, jobTitle, company,
    location: location || undefined,
    url: url || undefined,
    jdRaw: jdRaw || undefined,
    status: (status || 'applied') as ApplicationStatus,
    salaryMin: salaryMin ? Number(salaryMin) : undefined,
    salaryMax: salaryMax ? Number(salaryMax) : undefined,
    currency: currency || undefined,
    notes: notes || undefined,
    createdAt, updatedAt,
  }
}

function appToRow(app: Application): string[] {
  const a = app as unknown as Record<string, unknown>
  return APP_HEADERS.map(h => cell(a[h]))
}

// ── Provider ──────────────────────────────────────────────────────────────────

export class SheetsProvider implements DataProvider {
  private id: string

  constructor() {
    const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    if (!id) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not set')
    this.id = id
  }

  // ── Applications ─────────────────────────────────────────

  async listApplications(): Promise<Application[]> {
    await ensureSheets(this.id)
    const res = await sheetsGet(`/${this.id}/values/applications!A2:M`)
    const data = await res.json() as { values?: string[][] }
    return (data.values ?? []).filter(r => r[0]).map(rowToApp)
  }

  async getApplication(id: string): Promise<Application | null> {
    const all = await this.listApplications()
    return all.find(a => a.id === id) ?? null
  }

  async upsertApplication(app: Application): Promise<Application> {
    await ensureSheets(this.id)
    const all = await this.listApplications()
    const idx = all.findIndex(a => a.id === app.id)
    if (idx !== -1) {
      // Update existing row (row index + 2 for header + 1-based)
      const rowNum = idx + 2
      await sheetsPut(
        `/${this.id}/values/applications!A${rowNum}:M${rowNum}?valueInputOption=RAW`,
        { values: [appToRow(app)] },
      )
    } else {
      await sheetsPost(`/${this.id}/values/applications!A1:M1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        values: [appToRow(app)],
      })
    }
    return app
  }

  async deleteApplication(id: string): Promise<void> {
    await ensureSheets(this.id)
    const all = await this.listApplications()
    const idx = all.findIndex(a => a.id === id)
    if (idx === -1) return
    // Clear the row (Sheets doesn't natively delete rows easily without batchUpdate)
    const rowNum = idx + 2
    await sheetsPut(
      `/${this.id}/values/applications!A${rowNum}:M${rowNum}?valueInputOption=RAW`,
      { values: [APP_HEADERS.map(() => '')] },
    )
  }

  // ── Job suggestions ───────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listSuggestions(_status?: SuggestionStatus): Promise<JobSuggestion[]> {
    return []
  }

  async saveSuggestion(s: JobSuggestion): Promise<JobSuggestion> {
    return s
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async dismissSuggestion(_id: string): Promise<void> {}

  // ── User profile ──────────────────────────────────────────

  async getProfile(): Promise<UserProfile | null> {
    await ensureSheets(this.id)
    const res = await sheetsGet(`/${this.id}/values/profile!A1`)
    const data = await res.json() as { values?: string[][] }
    const raw = data.values?.[0]?.[0]
    if (!raw) return null
    try { return JSON.parse(raw) as UserProfile } catch { return null }
  }

  async saveProfile(p: UserProfile): Promise<void> {
    await ensureSheets(this.id)
    await sheetsPut(
      `/${this.id}/values/profile!A1?valueInputOption=RAW`,
      { values: [[JSON.stringify(p)]] },
    )
  }

  // ── Generated documents ───────────────────────────────────
  // Stored in-memory only for the Sheets adapter (no dedicated sheet)

  private _docs = new Map<string, GeneratedDocument[]>()

  async saveDocument(doc: GeneratedDocument): Promise<GeneratedDocument> {
    const list = this._docs.get(doc.applicationId) ?? []
    const idx = list.findIndex(d => d.id === doc.id)
    if (idx !== -1) list[idx] = doc; else list.push(doc)
    this._docs.set(doc.applicationId, list)
    return doc
  }

  async listDocuments(applicationId: string): Promise<GeneratedDocument[]> {
    return this._docs.get(applicationId) ?? []
  }
}
