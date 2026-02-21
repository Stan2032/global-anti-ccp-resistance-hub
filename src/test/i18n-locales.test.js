import { describe, it, expect } from 'vitest'
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
function getAllKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      return getAllKeys(value, path)
    }
    return path
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
        localeKeys.forEach(key => {
          const keys = key.split('.')
          let value = locale
          for (const k of keys) value = value[k]
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
