import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

// ~12 000 tokens at ~4 chars/token — enough for a full CV without blowing context
const MAX_CHARS = 48_000
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB

// PDF magic: %PDF  |  DOCX/ZIP magic: PK\x03\x04
const PDF_MAGIC  = [0x25, 0x50, 0x44, 0x46] // %PDF
const DOCX_MAGIC = [0x50, 0x4b, 0x03, 0x04] // PK (ZIP)

function matchesMagic(buf: Uint8Array, magic: number[]): boolean {
  return magic.every((byte, i) => buf[i] === byte)
}

export async function parseCvToText(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) return ''

  const name = file.name.toLowerCase()
  const arrayBuffer = await file.arrayBuffer()
  const header = new Uint8Array(arrayBuffer, 0, 4)

  if (name.endsWith('.pdf')) {
    if (!matchesMagic(header, PDF_MAGIC)) return ''
    const parser = new PDFParse({ data: arrayBuffer })
    const result = await parser.getText()
    await parser.destroy()
    return truncate(normalise(result.text))
  }

  if (name.endsWith('.docx')) {
    if (!matchesMagic(header, DOCX_MAGIC)) return ''
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.extractRawText({ buffer })
    return truncate(normalise(result.value))
  }

  return ''
}

function normalise(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function truncate(text: string): string {
  if (text.length <= MAX_CHARS) return text
  return text.slice(0, MAX_CHARS) + '\n\n[CV truncated — document exceeds size limit]'
}
