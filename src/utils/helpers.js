import moment from 'moment-timezone';

export default {
    formatDate(date, filterFormat = 'DD-MMM-YYYY') {
        if (date === 'Invalid date' || !date) return '-';
        return moment.utc(date).format(filterFormat);
    }
};
