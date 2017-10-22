'use strict';
/**
 * 登录Store
 */
import app from './app';

//exports
module.exports = {
    events: {},
    doLogin: function (userName, passWord) {
        return new Promise((resolve, reject) => {
                resolve('app-preload:end loadAppConstant');
        })
    },
    quitLogin: function (userName, passWord) {
        return new Promise((resolve, reject) => {
            app.ajax({
                url: '/services/usm/logout',
                type: 'POST',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            })
        })
    }
};


