import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { translations } from '../contexts/languageUtils'
import enLocale from '../locales/en.json'
import zhCNLocale from '../locales/zh-CN.json'
import zhTWLocale from '../locales/zh-TW.json'
import viLocale from '../locales/vi.json'
import koLocale from '../locales/ko.json'
import jaLocale from '../locales/ja.json'
import ugLocale from '../locales/ug.json'
import boLocale from '../locales/bo.json'

const locales = {
  'en': enLocale,
  'zh-CN': zhCNLocale,
  'zh-TW': zhTWLocale,
  'vi': viLocale,
  'ko': koLocale,
  'ja': jaLocale,
  'ug': ugLocale,
  'bo': boLocale
}

// Get all keys from a nested object as dot-notation paths
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]): string[] => {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      return getAllKeys(value as Record<string, unknown>, path)
    }
    return [path]
  })
}

describe('i18n locale files', () => {
  const enKeys = getAllKeys(enLocale)

  it('English locale has all expected sections', () => {
    expect(Object.keys(enLocale)).toContain('common')
    expect(Object.keys(enLocale)).toContain('nav')
    expect(Object.keys(enLocale)).toContain('dashboard')
    expect(Object.keys(enLocale)).toContain('security')
  })

  it('English locale has essential nav keys', () => {
    expect(enLocale.nav.dashboard).toBe('Dashboard')
    expect(enLocale.nav.intelligence).toBe('Intelligence')
    expect(enLocale.nav.prisoners).toBe('Political Prisoners')
    expect(enLocale.nav.takeAction).toBe('Take Action')
    expect(enLocale.nav.security).toBe('Security')
    expect(enLocale.nav.dataSources).toBe('Data Sources')
  })

  Object.entries(locales).forEach(([code, locale]) => {
    if (code === 'en') return

    describe(`${code} locale`, () => {
      it('has the same sections as English', () => {
        const enSections = Object.keys(enLocale).sort()
        const localeSections = Object.keys(locale).sort()
        expect(localeSections).toEqual(enSections)
      })

      it('has the same keys as English', () => {
        const localeKeys = getAllKeys(locale)
        expect(localeKeys.sort()).toEqual(enKeys.sort())
      })

      it('has no empty string values', () => {
        const localeKeys = getAllKeys(locale)
        localeKeys.forEach((key: string) => {
          const keys = key.split('.')
          let value: unknown = locale
          for (const k of keys) value = (value as Record<string, unknown>)[k]
          expect(value, `${code}.${key} should not be empty`).not.toBe('')
        })
      })

      it('has translated nav items (not same as English)', () => {
        // At least nav.dashboard should differ from English
        expect(locale.nav.dashboard).not.toBe(enLocale.nav.dashboard)
      })
    })
  })
})

describe('every t() key the app uses', () => {
  // t() returns the key itself when nothing matches, so a wrong key never
  // fails loudly: the skip links showed "skipToMain" and "skipToNav" to
  // every keyboard and screen-reader user.
  it('resolves to English text, the way t() looks it up', () => {
    const src = path.resolve(__dirname, '..')
    const keys = new Set<string>()
    for (const f of readdirSync(src, { recursive: true }) as string[]) {
      if (!/\.tsx?$/.test(f) || f.startsWith(`test${path.sep}`)) continue
      for (const m of readFileSync(path.join(src, f), 'utf-8').matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) keys.add(m[1])
    }
    expect(keys, 'the scan sees the calls it checks').toContain('accessibility.skipToMain')
    const lookup = (obj: unknown, key: string) =>
      key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj)
    const unresolved = [...keys].filter(
      (k) => typeof lookup(translations.en, k) !== 'string' && typeof lookup(enLocale, k) !== 'string'
    )
    expect(unresolved).toEqual([])
  })
})
