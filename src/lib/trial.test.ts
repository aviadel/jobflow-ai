import { afterEach, describe, expect, it, vi } from 'vitest'
import { createHmac } from 'crypto'
import { TRIAL_DAYS, parseTrialCookie } from './license'

const SECRET = 'test-trial-secret'
const DAY = 86_400_000
const NOW = 1_780_000_000_000

function signed(startedAt: number, secret = SECRET) {
  const ts = String(startedAt)
  return `${ts}.${createHmac('sha256', secret).update(ts).digest('hex')}`
}

function at(now: number) {
  vi.useFakeTimers()
  vi.setSystemTime(now)
}

afterEach(() => vi.useRealTimers())

describe('parseTrialCookie - active trial', () => {
  it('reports the full window on day zero', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW), SECRET)).toEqual({ daysLeft: TRIAL_DAYS })
  })

  it('counts down as the trial runs', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW - 3 * DAY), SECRET)).toEqual({ daysLeft: 4 })
  })

  it('still allows access on the final day', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW - 6.5 * DAY), SECRET)?.daysLeft).toBe(1)
  })
})

describe('parseTrialCookie - expiry', () => {
  it('expires exactly at 7 days', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW - TRIAL_DAYS * DAY), SECRET)).toBeNull()
  })

  it('stays expired long afterwards', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW - 400 * DAY), SECRET)).toBeNull()
  })
})

describe('parseTrialCookie - tampering', () => {
  it('rejects a back-dated start with the original signature', () => {
    at(NOW)
    const real = signed(NOW - 6 * DAY)
    const sig = real.split('.')[1]
    // Attacker rewrites the timestamp to "now" but cannot re-sign it.
    expect(parseTrialCookie(`${NOW}.${sig}`, SECRET)).toBeNull()
  })

  it('rejects a cookie signed with a different instance secret', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW, 'someone-elses-secret'), SECRET)).toBeNull()
  })

  it('rejects an unsigned timestamp', () => {
    at(NOW)
    expect(parseTrialCookie(String(NOW), SECRET)).toBeNull()
  })

  it('rejects a future start date', () => {
    at(NOW)
    // Would otherwise read as more than a full trial remaining.
    const r = parseTrialCookie(signed(NOW + 100 * DAY), SECRET)
    expect(r === null || r.daysLeft <= TRIAL_DAYS).toBe(true)
  })
})

describe('parseTrialCookie - malformed input', () => {
  it.each([
    ['undefined', undefined],
    ['empty', ''],
    ['no separator', 'abcdef'],
    ['empty timestamp', '.abc'],
    ['non-numeric timestamp', 'abc.def'],
    ['zero timestamp', signed(0)],
    ['negative timestamp', signed(-1)],
    ['non-hex signature', `${NOW}.zzzz`],
  ])('rejects %s without throwing', (_label, value) => {
    at(NOW)
    expect(() => parseTrialCookie(value as string | undefined, SECRET)).not.toThrow()
    expect(parseTrialCookie(value as string | undefined, SECRET)).toBeNull()
  })

  it('rejects everything when the instance has no secret', () => {
    at(NOW)
    expect(parseTrialCookie(signed(NOW), '')).toBeNull()
  })
})
