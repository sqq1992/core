/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/28
 */

/*global app, _, $, define, console, JSONTree, moment*/
define(function(require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getLogDetail');
    model.api = '/sources/logs/campaigns/{campaignId}/details/{taskId}';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'taskId': 'Number',
        'mode' : 'Number'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function(requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);

        if (!requestParams.campaignId) {
            throw new window.Error("API.campaign.getLogDetail: *缺少参数：campaignId");
        }
        if (!requestParams.taskId) {
            throw new window.Error("API.campaign.getLogDetail: *缺少参数：taskId");
        }

        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb) {
        if (json.success) {
            if (_.isFunction(cb)) {
                cb(json.data);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});