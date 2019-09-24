export const utils = {
  paramData: (params) => {
    const searchParams = new URLSearchParams();
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          let value = params[key];
          if (value === null || value === undefined) continue;
          if (Array.isArray(value)) {
            // 判断value是数组
            if (value.length === 0) continue;
            for (let index = 0; index < value.length; index++) {
              let k = key;
              let v = value[index];
              searchParams.append(k, v);
            }
          } else if (typeof (value) === 'object') {
            // 判断value是对象
            for (let subKey in value) {
              if (value.hasOwnProperty(subKey)) {
                let a = value[subKey];
                if (a === null) continue;
                let b = key + '.' + subKey;
                searchParams.append(b, a);
              }
            }
          } else {
            searchParams.append(key, value);
          }
        }
      }
    } else {
      return false
    }

    /*
     *   测试时控制台查看传的参数，部署时删除
     * */
    // console.log('打印URLSearchParams参数');
    // for (let pair of searchParams.entries()) {
    //   console.log(pair[0] + ':' + pair[1])
    // }
    return searchParams;
  },

  dateFormat: (value, number = 0) => {
    let ms = number * 86400000;
    let d = new Date(new Date(value).getTime() + ms);
    let year = d.getFullYear();
    let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    return (
      year + '-' + month + '-' + day
    );
  },

  dateTimeFormat: (value) => {
    let d = new Date(value);
    let year = d.getFullYear();
    let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : '' + d.getMonth() + 1;
    let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    let hour = d.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    let minutes = d.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes;
    let seconds = d.getSeconds();
    seconds = seconds > 9 ? seconds : '0' + seconds;
    return (
      year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
    );
  }

};
