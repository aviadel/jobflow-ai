import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null

export function getClaudeClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

// Sonnet: fast JSON extraction (analyze-jd, structured parsing)
const MODEL_FAST = 'claude-sonnet-4-6'

// Opus: long-form generation (CV bullets, cover letter) — best prose quality
const MODEL_QUALITY = 'claude-opus-5'

export async function claudeComplete(
  system: string,
  user: string,
  maxTokens = 4000,
  quality: 'fast' | 'quality' = 'fast'
): Promise<string> {
  const client = getClaudeClient()
  const model = quality === 'quality' ? MODEL_QUALITY : MODEL_FAST

  const msg = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  })

  if (msg.stop_reason === 'max_tokens') {
    throw new Error(
      `Claude output was truncated (hit ${maxTokens} token limit on ${model}). Increase maxTokens or reduce prompt size.`
    )
  }

  const block = msg.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude')
  return block.text.trim()
}
