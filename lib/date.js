export function formatDate(dateString) {
    try {
        // Check if dateString is valid
        if (!dateString) return 'No date provided';

        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) return 'Invalid date format';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}