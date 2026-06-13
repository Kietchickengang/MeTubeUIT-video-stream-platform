import axios from 'axios';

const api_port = import.meta.env.VITE_API_SERVER_PORT || '8000';
const host = `http://localhost:${api_port}/metube`;

console.log('API Host:', host);

const defaultConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const registerUser = async (payload) => {
  const response = await axios.post(`${host}/auth/register`, payload, defaultConfig);
  return response.data;
};

export const registerRequest = async (payload) => {
  const response = await axios.post(`${host}/auth/register-request`, payload, defaultConfig);
  return response.data;
};

export const registerVerify = async (payload) => {
  const response = await axios.post(`${host}/auth/register-verify`, payload, defaultConfig);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axios.post(`${host}/auth/login`, payload, defaultConfig);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${host}/auth/logout`, {}, defaultConfig);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${host}/auth/me`, defaultConfig);
  return response.data;
};

export const changeAvatar = async (payload) => {
  const response = await axios.post(`${host}/auth/change-avatar`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
  });
  return response.data;
}

export const changePassword = async (payload) => {
  const response = await axios.post(`${host}/auth/change-password`, payload, defaultConfig);
  return response.data;
};

export const subscribeChannel = async (channelId) => {
  const response = await axios.post(`${host}/auth/subscribe/${channelId}`, {}, defaultConfig);
  return response.data;
};

export const unsubscribeChannel = async (channelId) => {
  const response = await axios.post(`${host}/auth/unsubscribe/${channelId}`, {}, defaultConfig);
  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(`${host}/auth/notifications`, defaultConfig);
  return response.data;
};

