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
        data.chosenItems.forEach(function (elem) {
            elem.adgroupItem = elem.adgroupItem || {};
            elem.adgroupItem.adgroupId = elem.adgroupId;
            elem.adgroupItem.adgroup = elem.adgroupItem.adgroup || {};
            elem.adgroupItem.item = elem.item;

            if (elem.adgroupProfile) {
                elem.adgroupItem.adgroup = elem.adgroupProfile.adgroupItem.adgroup;
                elem.report = elem.adgroupProfile.report;
            }

            if (elem.daemonSettingJson.allow_add_word === '1' && elem.daemonSettingJson.allow_adjust_word === '1' &&  elem.daemonSettingJson.allow_del_word === '1') {
                // 全自动优化
                elem.optimizationState = 1;
            } else if (elem.daemonSettingJson.daemonSettingJson === '0' && elem.daemonSettingJson.allow_adjust_word === '1' &&  elem.daemonSettingJson.allow_del_word === '0') {
                // 只优化出价，不优化出词
                elem.optimizationState = 0;
            }
        });
        return data;
    }

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getChosenList');
    model.api = '/sources/hostingCampaignChosenItems';
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
            throw new window.Error("API.adgroup.getChosenList: *缺少参数：campaignId");
        }

        if (!requestParams.engineNo) {
            throw new window.Error("API.adgroup.getChosenList: *缺少参数：engineNo");
        }

        if (!requestParams.engineType) {
            throw new window.Error("API.adgroup.getChosenList: *缺少参数：engineType");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json;

            if (isFormat) {
                _data = format(_data.data);
            }
            console.log(_data);
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