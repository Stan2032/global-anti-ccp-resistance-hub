/**
 * Export utilities for data conversion (CSV, Markdown).
 * Used by the DataExport component.
 */

/**
 * Extracts a flat records array from various JSON shapes.
 *
 * Handles:
 * - Flat arrays (returned as-is)
 * - `{ results: [{ output }] }` wrappers (unwraps each `.output`)
 * - `{ sanctions: [] }` wrappers (returns the `.sanctions` array)
 *
 * @param data - Raw JSON data (unknown shape).
 * @returns A flat array of record objects.
 */
export function extractRecords(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  const obj = data as Record<string, unknown> | null | undefined;
  if (obj?.results) return (obj.results as Record<string, unknown>[]).map(r => (r.output as Record<string, unknown>) || r);
  if (obj?.sanctions) return obj.sanctions as Record<string, unknown>[];
  return [];
}

/**
 * Converts an array of record objects to a CSV string.
 *
 * @param records - Array of objects to convert.
 * @param fields - Optional list of column headers. Defaults to keys of the first record.
 * @returns CSV-formatted string with a header row and one data row per record.
 *          Values containing commas, quotes, or newlines are properly escaped.
 */
export function recordsToCsv(records: Record<string, unknown>[], fields?: string[]): string {
  if (!records?.length) return '';
  const headers = fields || Object.keys(records[0]);
  const escapeCsv = (val: unknown): string => {
    const str = val == null ? '' : String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const rows = records.map(r => headers.map(h => escapeCsv(r[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

const MAX_CELL_LENGTH = 100;

/**
 * Converts an array of record objects to a Markdown table string.
 *
 * @param records - Array of objects to convert.
 * @param fields - Optional list of column headers. Defaults to keys of the first record.
 * @returns A Markdown-formatted table. Cell values are truncated to
 *          {@link MAX_CELL_LENGTH} characters and pipes/newlines are escaped.
 */
export function recordsToMarkdown(records: Record<string, unknown>[], fields?: string[]): string {
  if (!records?.length) return '';
  const headers = fields || Object.keys(records[0]);
  const headerRow = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const rows = records.map(r =>
    `| ${headers.map(h => {
      const val = r[h];
      const str = val == null ? '' : String(val).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      return str.length > MAX_CELL_LENGTH ? str.slice(0, MAX_CELL_LENGTH - 3) + '...' : str;
    }).join(' | ')} |`
  );
  return [headerRow, separator, ...rows].join('\n');
}
