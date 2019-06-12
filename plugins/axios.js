import axios from 'axios'


let url=process.env.NODE_ENV=='development'?'http://localhost:8080':'';

// 创建axios实例
const service = axios.create({
//   baseURL: process.env.BASE_API,// node环境的不同，对应不同的baseURL
baseURL:  url,
timeout: 5000, // 请求的超时时间
  headers: {  
    "Content-Type": "application/json;charset=utf-8"
  },
  withCredentials: true // 允许携带cookie
})

export default service;
