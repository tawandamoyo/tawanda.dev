const { DateTime } = require('luxon');

// Date formatting (human readable)
function readableDateFilter (dateObj) {
  return DateTime.fromSQL(dateObj).toFormat('DDD');
};

// Date formatting (machine readable)
function machineDateFilter (dateObj) {
  return DateTime.fromSQL(dateObj).toFormat('yyyy-MM-dd');
}

module.exports = {
  readableDateFilter,
  machineDateFilter,
};