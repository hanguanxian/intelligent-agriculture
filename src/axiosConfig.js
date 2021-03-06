import axios from 'axios';
import QS from 'qs';

let config = {
  paramsSerializer: function(params) {
    return QS.stringify(params);
  },
  validateStatus: function(status) {
    return status < 500; // 默认的
  }
}

//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.paramsSerializer = config.paramsSerializer;
//axios.defaults.validateStatus = config.validateStatus;
axios.interceptors.response.use(function(response) {
  if (response.loginStatus == 0) {
    window.location.href = location.origin + '#login';
    return;
  }
  return response;
});

export default axios;
