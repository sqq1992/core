/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/20
 */


/*global define, require, exports, module, app, _, $, console*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');


    var model = new Model('getTrend');
    model.api = '/sources/keywords/trend';
    model.type = 'get';

    // 请求参数
    model.requestParams = {
        'keywordId': 'Number',
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.keywordId) {
            throw new window.Error("API.keyword.getTrend: *缺少参数：keywordId");
        }
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getTrend: *缺少参数：campaignId");
        }
        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getTrend: *缺少参数：adgroupId");
        }
        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            if (_.isFunction(cb)) {
                cb(json);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});
