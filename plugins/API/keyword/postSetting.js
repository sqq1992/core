/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/6
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('postSetting');
    model.api = '/sources/keywords/setting';
    model.type = 'post-arrs';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'word': 'String',
        'keywordId': 'Number',
        'isOptimizeGenerateWord': 'Number',
        'isOptimizeChangePrice': 'Number',
        'isOptimizeChangeMatchScope': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.word) {
            throw new window.Error("API.keyword.postSetting: *缺少参数：word");
        }

        if (!requestParams.keywordId) {
            throw new window.Error("API.keyword.postSetting: *缺少参数：keywordId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json;

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