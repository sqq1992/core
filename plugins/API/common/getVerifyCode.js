/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 16-4-19.
 */


/*global app, _, $, console, JSONTree, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getVerifyCode');
    model.api = '/sources/users/verifyCode';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'phoneNumber': 'Number'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.phoneNumber) {
            throw new window.Error("API.common.getVerifyCode: *缺少参数：phoneNumber");
        }
        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {

            var result = json;
            model.data = result;

            if (_.isFunction(cb)) {
                cb(result);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});