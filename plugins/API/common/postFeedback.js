/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 16-4-20.
 */


/*global app, _, $, console, JSONTree, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('postFeedback');
    model.api = '/sources/cusService/cusScoreUrl/pop';
    model.type = 'post';
    // 请求参数
    model.requestParams = {
        'attitudeScore': 'Number',
        'abilityScore': 'Number',
        'softScore': 'Number'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
     model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
            if (!requestParams.attitudeScore) {
                throw new window.Error("API.common.postFeedback: *缺少参数：attitudeScore");
            }

         if (!requestParams.abilityScore) {
             throw new window.Error("API.common.postFeedback: *缺少参数：abilityScore");
         }

         if (!requestParams.softScore) {
             throw new window.Error("API.common.postFeedback: *缺少参数：softScore");
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