import moment from 'moment-timezone';

export default {
    formatDate(date, filterFormat = 'DD-MMM-YYYY') {
        if (date === 'Invalid date' || !date) return '-';
        return moment.utc(date).format(filterFormat);
    },
    formatDateAgo(date) {
        if (!date || moment(date).isValid() === false) {
            return 'Invalid date format';
        }
        return moment.utc(date).fromNow();
    },
    formatTime(date) {
        if (!date || date === 'Invalid date') {
            return '-';
        }
        return moment(date).format('h:mm A');
    }
};
