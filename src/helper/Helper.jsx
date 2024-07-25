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


export async function base64ToFile(base64String, filename, contentType) {
    // Split the base64 string
    const base64ContentArray = base64String.split(';base64,');

    // Extract the content type and base64 payload
    contentType = contentType || base64ContentArray[0].split(':')[1];
    const base64 = base64ContentArray[1];

    // Decode the base64 content
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    // Convert to array of byte values
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Convert to ArrayBuffer
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    // Create a File object
    const file = new File([blob], filename, { type: contentType });

    return file;
}