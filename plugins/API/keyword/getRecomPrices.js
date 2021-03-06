/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/21
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getRecomPrices');
    model.api = '/sources/keywordsDiagnosisInfo';
    model.type = 'post-arr';
    // 请求参数
    model.requestParams = {
        'adgroupId': 'Number',
        'campaignId': 'Number',
        'word': 'Array'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getRecomPrices: *缺少参数：adgroupId");
        }

        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getRecomPrices: *缺少参数：campaignId");
        }

        if (!requestParams.word) {
            throw new window.Error("API.keyword.getRecomPrices: *缺少参数：word");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.keywordDiagnosisInfo;

            if (_.isFunction(cb)) {
                cb(_data);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});