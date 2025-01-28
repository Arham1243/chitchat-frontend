const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

import AxiosService from './Axios.service';
export const test = () => {
    return AxiosService.get('https://jsonplaceholder.typicode.com/users');
};
