/**
 * Extracts start and end dates from a date range string in the format "DD/MM/YYYY au DD/MM/YYYY"
 * @param {string} dateRangeString - The date range string to parse
 * @returns {Object} An object containing the start and end dates as Date objects and formatted strings
 */
export function extractDateRange(dateRangeString) {
  // Regular expression to match dates in the format DD/MM/YYYY
  const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
  
  // Find all dates in the string
  const dates = dateRangeString.match(dateRegex);
  
  if (!dates || dates.length < 2) {
    throw new Error("Could not find two valid dates in the format DD/MM/YYYY");
  }
  
  const startDateStr = dates[0];
  const endDateStr = dates[1];
  
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${month}/${day}/${year}`);
  };
  
  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);
  
  const formatDate = (date) => {
    return {
      object: date,
      iso: date.toISOString(),
      localeFormat: date.toLocaleDateString(),
      original: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    };
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    durationDays: Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  };
}
