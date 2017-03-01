/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/14
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('putNewCampaign');
    model.api = '/sources/campaign';
    model.type = 'put';
    // 请求参数
    model.requestParams = {
        'title': 'String'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.title) {
            throw new window.Error("API.campaign.putNewCampaign: *缺少参数：title");
        }
        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (_.isFunction(cb)) {
            cb(json);
        }
    };

    module.exports = model.entry;
});