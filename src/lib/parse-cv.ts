import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

export async function parseCvToText(file: File): Promise<string> {
  const name = file.name.toLowerCase()
  const arrayBuffer = await file.arrayBuffer()

  if (name.endsWith('.pdf')) {
    const parser = new PDFParse({ data: arrayBuffer })
    const result = await parser.getText()
    await parser.destroy()
    return normalise(result.text)
  }

  if (name.endsWith('.docx')) {
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.extractRawText({ buffer })
    return normalise(result.value)
  }

  // .doc (old binary format) — skip; system prompt handles missing cvText gracefully
  return ''
}

function normalise(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
