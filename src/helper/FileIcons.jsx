export function getFileIconClass(filename) {
    if (!filename) return 'bx bxs-file';

    const extension = filename.toLowerCase().split('.').pop();

    const iconMap = {
        // Images
        'jpg': 'bx bxs-image',
        'jpeg': 'bx bxs-image',
        'png': 'bx bxs-image',

        // Documents
        'pdf': 'bx bxs-file-pdf',
        'doc': 'bx bxs-file-doc',
        'docx': 'bx bxs-file-doc',

        // Spreadsheets
        'xls': 'bx bxs-spreadsheet',
        'xlsx': 'bx bxs-spreadsheet',

        // Presentations
        'ppt': 'bx bxs-file-presentation',
        'pptx': 'bx bxs-file-presentation',

        // Text files
        'txt': 'bx bxs-file-txt',

        // Archives
        'zip': 'bx bxs-archive'
    };

    return iconMap[extension] || 'bx bxs-file';
}
