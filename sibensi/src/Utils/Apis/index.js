import axios from 'axios';
import {getItem} from '../Storages';

const API = axios.create({
  baseURL: 'https://backend-skripsi-production-8553.up.railway.app',
});

API.interceptors.request.use(async req => {
  req.withCredentials = true;
  const response = await getItem('profile');
  if (response?.token) {
    req.headers.Authorization = `Bearer ${response?.token}`;
  }

  return req;
});

// Auth
export const loginApi = async data => API.post('/user/login', data);
export const loginAdminApi = async data => API.post('/admin/login', data);
export const removeTokenApi = async id => API.delete(`/user/${id}`);
export const removeTokenAdminApi = async id =>
  API.delete(`/admin/remove-token/${id}`);

// User
export const getUserByIdApi = async id => API.get(`/user/${id}`);
export const changePasswordApi = async (id, data) =>
  API.patch(`/user/change-password/${id}`, data);
export const createUserApi = async data =>
  API.post('/user', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
export const updateUserApi = async (id, data) =>
  API.patch(`/user/edit-data/${id}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
export const getUserByAdminApi = async id => API.get(`/user/get-data/${id}`);

// Admin
export const getAdminByIdApi = async id => API.get(`/admin/${id}`);
export const getUserApi = async () => API.get('/admin/get-user');
export const deleteUserApi = async id => API.delete(`/admin/user-delete/${id}`);
export const getKehadiran = async (start, end) =>
  API.get(`/admin/kehadiran?start=${start}&end=${end}`);
export const changePasswordAdminApi = async (id, data) =>
  API.put(`/admin/change-password/${id}`, data);

// Absensi
export const getAbsensiByIdApi = async id => API.get(`/absensi/${id}`);

// Face
export const postFaceUser = async (id, data) =>
  await API.patch(`/face/${id}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });

// Setting
export const getSetting = async id => API.get(`/setting/${id}`);
export const updateSetting = async (id, data) =>
  API.put(`/setting/${id}`, data);
