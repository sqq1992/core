/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/23
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    function format(data) {
        var result = [];
        data.outerItems.forEach(function (elem) {
            result.push({
                adgroupItem: {
                    item: elem
                }
            });
        });
        return result;
    }

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getOuterList');
    model.api = '/sources/hostingCampaignOuterItems';
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
            throw new window.Error("API.adgroup.getOuterList: *缺少参数：campaignId");
        }

        if (!requestParams.engineNo) {
            throw new window.Error("API.adgroup.getOuterList: *缺少参数：engineNo");
        }

        if (!requestParams.engineType) {
            throw new window.Error("API.adgroup.getOuterList: *缺少参数：engineType");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json;

            if (isFormat) {
                _data = format(_data.data);
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