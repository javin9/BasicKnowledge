import originJsonp from 'jsonp';

export function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    if (!!data) {
      url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
    }
    originJsonp(url,option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  });
}
/*
{opts} 
   type:'get',
   url:'',
   data:''
*/
export function ajax(opts) {
  var url=opts.url;
  return new Promise((resolve, reject) => {
    if (!!opts.data) {
      url += (url.indexOf('?') < 0 ? '?' : '&') + param(opts.data);
    }

    var xhr = new XMLHttpRequest();
    xhr.open(opts.type, url, true);
    xhr.send(null);

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
        resolve(xhr.responseText)
      } else {
        resolve(xhr.status);
      }
    };
    xhr.onerror = function() {
      reject('链接失败')
    }

  })
}

function param(data) {
  var url = '';
  for (var key in data) {
    var value = data[key];
    url += `&${key}=${encodeURIComponent(value)}`;
  }
  return !!url ? url.substring(1) : '';
}
