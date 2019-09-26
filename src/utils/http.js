import axios from 'axios';
import {
  MessageBox
} from 'element-ui';
import * as Api from './server'
import router from '../router/index';
let baseUrlStr = Api.api;

// axios 配置
// axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseUrlStr;
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// // 请求拦截器
// http.interceptors.request.use(config => {
//   loadingInstance = Loading.service({
//     fullscreen: true,
//     lock: true,
//     text: '正在请求数据...'
//   });
//
//   // 开发环境下，如果请求是 post,put,patch,则打印数据体，方便调试
//   if (process.env.NODE_ENV === 'development') {
//     const {method} = config;
//     if (method === 'post' || method === 'put' || method === 'patch') {
//       console.log(config.data);
//     }
//   }
//
//   return config;
// }, error => {
//   loadingInstance.close();
//   Message.error({
//     message: '请求失败'
//   });
//   return Promise.reject(error);
// });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      MessageBox.alert('身份信息已过期，请重新登陆', '提示', {
        confirmButtonText: '重新登陆',
        showClose: false,
        type: 'error',
        callback: action => {
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }
      });
    }
    return Promise.reject(error)
  }
);


// axios 封装（GET ,POST, PUT, PATCH）

/*
 * get 请求
 * */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/*
 * post 请求
 * */
export function post(url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      })
  })
}

/*
 * put 请求
 * */
export function put(url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data, config)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      })
  })
}
/*
 * del 请求
 * */
export function del(url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data, config)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      })
  })
}
/*
 * patch 请求
 * */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  })
}
