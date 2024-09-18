export function timestampToDateTime(timestamp) {
  try {
    const date = new Date(parseInt(timestamp)); // Parse timestamp as an integer
    const options = {
      year: 'numeric',
      month: 'short', // Use 'short' for "Sep" instead of "September"
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // This adds the AM/PM format
    };
    const formattedDateTime = date.toLocaleString('en-US', options); // Use 'en-US' for month/day ordering
    return formattedDateTime;
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    console.log('Timestamp value:', timestamp);
    return 'Invalid Timestamp';
  }
}
export function formatDateString(isoDateString) {
  try {
    const date = new Date(isoDateString);
    const options = {
      year: 'numeric',
      month: 'short', // Use 'short' for month abbreviations like "Sep"
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // For AM/PM format
    };
    return date.toLocaleString('en-US', options); // 'en-US' ensures correct formatting
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}
