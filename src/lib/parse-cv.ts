import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

// ~12 000 tokens at ~4 chars/token — enough for a full CV without blowing context
const MAX_CHARS = 48_000

export async function parseCvToText(file: File): Promise<string> {
  const name = file.name.toLowerCase()
  const arrayBuffer = await file.arrayBuffer()

  if (name.endsWith('.pdf')) {
    const parser = new PDFParse({ data: arrayBuffer })
    const result = await parser.getText()
    await parser.destroy()
    return truncate(normalise(result.text))
  }

  if (name.endsWith('.docx')) {
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
