/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/2/28
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getBestPpr');
    model.api = '/sources/keywords/keywordRankingForecast/bestPpr';
    model.type = 'post';
    // 请求参数
    model.requestParams = {
        'keywordIds': 'Array',
        'lowPrice': 'Float',
        'highPrice': 'Float'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.keywordIds) {
            throw new window.Error("API.keyword.getBestPpr: *缺少参数：keywordIds");
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