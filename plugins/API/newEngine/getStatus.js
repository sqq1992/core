/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/27
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var unitDate = {
        campaignHostingStatus: 'Object',
        addItemsAsAdgroupsStatus: 'Object',
        addCreativesToAdgroupsStatus: 'Object',
        adgroupsHostingStatus: 'Object'
    };



    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getStatus');
    model.api = '/sources/hostingCampaigns';
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
            throw new window.Error("API.newEngine.getStatus: *缺少参数：campaignId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json;

            if(isFormat) {
                _data = _data.data.hostingStatus;
            }

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