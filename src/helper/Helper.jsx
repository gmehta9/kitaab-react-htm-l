export const srcPriFixLocal = './assets/images/'

export function formatDateTime(dateTime, format) {
    const pad = (value) => String(value).padStart(2, '0');

    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    // Replace placeholders with corresponding date and time parts
    return format
        .replace('DD', pad(date))
        .replace('MM', pad(month))
        .replace('YYYY', year)
        .replace('hh', pad(hours))
        .replace('mm', pad(minutes))
        .replace('ss', pad(seconds));
}