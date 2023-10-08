import axios from "axios";

const request = axios.create({
  timeout: 24 * 60 * 60 * 1000, // 设置为 24 小时
});

//响应拦截器
// request.interceptors.response.use(
//   (res) => {
//     console.log(res.data);
//     if (res.data.ret !== 0) {
      
//     }
//     return res;
//   },
//   (error) => {
//     // router.replace("/500");
//     return Promise.reject(error);
//   }
// );
request.defaults.baseURL = "/api";

export default request;
