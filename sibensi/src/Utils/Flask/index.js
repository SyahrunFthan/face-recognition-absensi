import axios from 'axios';

const API = axios.create({ baseURL: 'http://192.168.1.16:5001' });

export const faceRecognition = async data =>
  API.post('/upload-image', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
