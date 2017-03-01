/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 15/11/13
 */


/*global app, _, $, define, console, JSONTree, moment*/
define(function(require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getLog');
    model.api = '/sources/logs/adgroups/{campaignId}/{adgroupId}';
    model.type = 'post';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'logType': 'String',
        'logDateType': 'Number',
        'operationType': 'Number',
        'operator': 'String',
        'pageNo': 'Number',
        'displayGrabRankLog': 'Boolean',
        'mode' : 'Number'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.adgroupId) {
            throw new window.Error("API.adGroup.getLog: *缺少参数：adgroupId");
        }

        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb) {
        if (json.success) {
            // TODO
            /*json.data.adgroupLogs.forEach(function (elem) {
                elem.content = elem.content.replace(/uic-module="uic-popmodule-btn"/g, 'data-tableEdit="detailLogs"');
            });*/

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