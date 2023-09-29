import axios from "axios";
const request = axios.create({
    timeout: 24 * 60 * 60 * 1000, // 设置为 24 小时
  });
  request.defaults.baseURL = '/api';

export default request