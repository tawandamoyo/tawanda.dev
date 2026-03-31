const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

const LOOKBACK_DAYS = 180;
const CLIPPINGS_FILE = path.join(__dirname, '..', 'My Clippings.txt');

const DATE_FORMATS = [
  'cccc, d LLLL yyyy HH:mm:ss',
  'cccc, d LLLL yyyy H:mm:ss',
  'cccc, LLLL d, yyyy h:mm:ss a',
  'cccc, LLLL d, yyyy hh:mm:ss a',
];

function parseDate(value) {
  for (const format of DATE_FORMATS) {
    const parsed = DateTime.fromFormat(value, format, { zone: 'utc' });
    if (parsed.isValid) return parsed;
  }

  const fallback = DateTime.fromJSDate(new Date(value));
  return fallback.isValid ? fallback : null;
}

function parseClippings(raw) {
  const byBook = new Map();

  raw
    .split('==========')
    .map(entry => entry.trim())
    .filter(Boolean)
    .forEach(entry => {
      const lines = entry
        .split(/\r?\n/)
        .map(line => line.replace(/\uFEFF/g, '').trim())
        .filter(Boolean);

      if (lines.length < 2) return;

      const title = lines[0];
      const meta = lines[1];
      const addedMatch = meta.match(/Added on (.+)$/);
      if (!addedMatch) return;

      const added = parseDate(addedMatch[1].trim());
      if (!added) return;

      const highlight = lines.slice(2).join(' ');
      const existing = byBook.get(title);

      if (!existing || added > existing.lastHighlightDate) {
        byBook.set(title, {
          title,
          lastHighlightDate: added,
          lastHighlight: highlight,
        });
      }
    });

  return Array.from(byBook.values());
}

module.exports = () => {
  if (!fs.existsSync(CLIPPINGS_FILE)) {
    return { current: [], lookbackDays: LOOKBACK_DAYS, lastUpdated: null };
  }

  const raw = fs.readFileSync(CLIPPINGS_FILE, 'utf8');
  const books = parseClippings(raw);
  const cutoff = DateTime.now().minus({ days: LOOKBACK_DAYS });
  
  const current = books
    .filter(book => book.lastHighlightDate >= cutoff)
    .sort((a, b) => b.lastHighlightDate - a.lastHighlightDate)
    .map(book => ({
      title: book.title,
      lastHighlightDate: book.lastHighlightDate.toISODate(),
      lastHighlightReadable: book.lastHighlightDate.toFormat('DDD'),
      lastHighlight: book.lastHighlight,
    }));

  const lastUpdated =
    books.length > 0
      ? books
          .reduce(
            (latest, book) =>
              book.lastHighlightDate > latest ? book.lastHighlightDate : latest,
            books[0].lastHighlightDate
          )
          .toISODate()
      : null;

  return { current, lookbackDays: LOOKBACK_DAYS, lastUpdated };
};
