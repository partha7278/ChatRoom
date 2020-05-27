import axios from 'axios';
import logger from '../logService';
import { toast } from 'react-toastify';


axios.interceptors.response.use(response =>{
    return response;
}, error => {
    if(error.response.status){
        const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

        if(!expectedError){
            logger(error);
            toast.error('An unexpected error occurred');
        }
    }

    return Promise.reject(error.response);
});







export default {
    get:axios.get,
    post:axios.post
}