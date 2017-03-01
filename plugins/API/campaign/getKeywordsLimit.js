/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/11/5
 */

/*global app, _, $, console, JSONTree, moment*/
define(function(require, exports, module) {
    'use strict';
    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getKeywordsLimit');
    model.api = '/sources/priceRanges/campaigns';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.campaign.getKeywordsLimit: *缺少参数：campaignId");
        }
        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
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