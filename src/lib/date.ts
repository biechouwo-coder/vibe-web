/**
 * Asia/Shanghai timezone date utilities.
 *
 * All "today" calculations use Shanghai timezone so that daily content,
 * tasks, and streaks are consistent regardless of where the server runs.
 * Keeps the DB schema unchanged (UTC Date columns).
 */

const TZ = 'Asia/Shanghai'

/** Year, month, day components for today in Shanghai. */
function shanghaiParts(): { year: number; month: number; day: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const p = fmt.formatToParts(new Date())
  return {
    year: Number(p.find((x) => x.type === 'year')!.value),
    month: Number(p.find((x) => x.type === 'month')!.value),
    day: Number(p.find((x) => x.type === 'day')!.value),
  }
}

/**
 * Returns a Date object set to **midnight UTC of the Shanghai-current day**.
 *
 * Example: when Shanghai is already 2026-05-11 but UTC is still 2026-05-10,
 * this returns `2026-05-11T00:00:00.000Z`. All DB queries and creations use
 * this consistent value so that users never see yesterday's content.
 */
export function getShanghaiDate(): Date {
  const { year, month, day } = shanghaiParts()
  return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`)
}

/**
 * Numeric seed `YYYYMMDD` used for daily content rotation.
 * Changes at midnight Shanghai time.
 */
export function getShanghaiDateSeed(): number {
  const { year, month, day } = shanghaiParts()
  return year * 10000 + month * 100 + day
}

/**
 * Week-of-year index (0-based) based on Shanghai timezone.
 * Used for weekly vocabulary rotation.
 */
export function getShanghaiWeekOfYear(): number {
  const { year, month, day } = shanghaiParts()
  const today = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`)
  const start = new Date(`${year}-01-01T00:00:00.000Z`)
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000)
  return Math.floor(diff / 7)
}

/**
 * Day-of-year index (0-based) based on Shanghai timezone.
 * Used for passage rotation (every 3 days).
 */
export function getShanghaiDayOfYear(): number {
  const { year, month, day } = shanghaiParts()
  const today = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`)
  const start = new Date(`${year}-01-01T00:00:00.000Z`)
  return Math.floor((today.getTime() - start.getTime()) / 86400000)
}

/**
 * Formats the current date in Shanghai timezone for display.
 */
export function formatShanghaiDate(
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, { timeZone: TZ, ...options }).format(new Date())
}
