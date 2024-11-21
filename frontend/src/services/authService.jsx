import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

const register = async (userData) => {
    return await axios.post(`${API_URL}/api/register`, userData);
};

const login = async (userData) => {
    return await axios.post(`${API_URL}/api/login`, userData);
};

export default {
    register,
    login,
};
