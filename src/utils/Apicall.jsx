import axios from 'axios';
import api from '../api';

const apicall = async (method, url, data = {}, header = false, headerType = 'user') => {
  try {
    let headers = {};

     if (header) {
      const token =
        headerType === 'admin'
          ? localStorage.getItem('adminToken')
          : localStorage.getItem('userToken');

      headers['Authorization'] = `Bearer ${token}`;
    }

    let apiUrl=`${api}${url}`

    const config = {
      method,
      url:apiUrl,
      headers,
    };

    if (method.toLowerCase() === 'get') {
      config.params = data;
    } else {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error.response ? error.response.data : error;
  }
};

export default apicall;
