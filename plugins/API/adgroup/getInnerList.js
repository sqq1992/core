/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/23
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getInnerList');
    model.api = '/sources/hostingCampaignInnerItems';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'engineNo': 'Number',
        'engineType': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.adgroup.getInnerList: *缺少参数：campaignId");
        }

        if (!requestParams.engineNo) {
            throw new window.Error("API.adgroup.getInnerList: *缺少参数：engineNo");
        }

        if (!requestParams.engineType) {
            throw new window.Error("API.adgroup.getInnerList: *缺少参数：engineType");
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