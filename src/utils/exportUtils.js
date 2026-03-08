/**
 * Export utilities for data conversion (CSV, Markdown).
 * Used by the DataExport component.
 *
 * @module exportUtils
 */

/**
 * Extract records array from JSON data.
 * Handles three common data shapes:
 * - Flat arrays → returned as-is
 * - `{ results: [{ output }] }` wrapper → unwrapped
 * - `{ sanctions: [] }` wrapper → unwrapped
 *
 * @param {Object|Array} data - Raw JSON data from a dataset file
 * @returns {Object[]} Flat array of record objects
 */
export function extractRecords(data) {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results.map(r => r.output || r);
  if (data?.sanctions) return data.sanctions;
  return [];
}

/**
 * Convert an array of objects to a CSV string.
 *
 * @param {Object[]} records - Array of data objects
 * @param {string[]} [fields] - Column headers to include (defaults to all keys of first record)
 * @returns {string} CSV-formatted string with header row
 */
export function recordsToCsv(records, fields) {
  if (!records?.length) return '';
  const headers = fields || Object.keys(records[0]);
  const escapeCsv = (val) => {
    const str = val == null ? '' : String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const rows = records.map(r => headers.map(h => escapeCsv(r[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

const MAX_CELL_LENGTH = 100;

/**
 * Convert an array of objects to a Markdown table string.
 * Cell values are truncated to {@link MAX_CELL_LENGTH} characters.
 *
 * @param {Object[]} records - Array of data objects
 * @param {string[]} [fields] - Column headers to include (defaults to all keys of first record)
 * @returns {string} Markdown table string
 */
export function recordsToMarkdown(records, fields) {
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
