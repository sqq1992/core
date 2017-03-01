/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 15/11/13
 */

/*global app, _, $, console, JSONTree, moment*/
define(function(require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');


    var model = new Model('getCreative');
    model.api = '/sources/creative';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
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

        if (!requestParams.fromDate) {
            requestParams.fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.toDate) {
            requestParams.toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }

        if (!requestParams.adgroupId) {
            throw new window.Error("API.adGroup.getCreative: *缺少参数：adgroupId");
        }

        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            json.data.creative.forEach(function (elem) {
                elem = utils.selfFormatData(elem.report);
            });
            model.data = json;
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