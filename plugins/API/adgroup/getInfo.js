/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 15/11/13
 */

/*global app, _, $, console, JSONTree, moment*/
define(function(require, exports, module) {
    'use strict';


    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getInfo');
    model.api = '/sources/adgroups/{adgroupId}/profiles';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.adGroup.getInfo: *缺少参数：campaignId");
        }

        if (!requestParams.adgroupId) {
            throw new window.Error("API.adGroup.getInfo: *缺少参数：adgroupId");
        }

        app.cache.addParams('request', requestParams);
    };


    function dataFormat (json) {
        var a = json.data.adgroupProfiles.daemonOptimizeSettingVO;
        if (a.isOptimizeChangePrice === '1' && a.isOptimizeGenerateWord === '1') {
            // 宝贝全自动优化
            json.data.adgroupProfiles.adGroupOptimizeStatus = 1;
        } else if (a.isOptimizeChangePrice === '1' && a.isOptimizeGenerateWord === '0') {
            // 宝贝只优化价格
            json.data.adgroupProfiles.adGroupOptimizeStatus = 0;
        } else if (a.isOptimizeChangePrice === '0' && a.isOptimizeGenerateWord === '0') {
            if (json.data.adgroupProfiles.adgroupItem.adgroup.isMandate) {
                // 宝贝不优化[出词&出价]
                json.data.adgroupProfiles.adGroupOptimizeStatus = 3;
            } else {
                // 宝贝不自动优化
                json.data.adgroupProfiles.adGroupOptimizeStatus = -1;
            }
        } else {
            // 宝贝只优化出词
            json.data.adgroupProfiles.adGroupOptimizeStatus = 2;
        }
        json.data.adgroupProfiles.report = utils.selfFormatData(json.data.adgroupProfiles.report);
        return json;
    }

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb) {
        json = dataFormat(json);
        if (json.success) {
            if (_.isFunction(cb)) {
                cb(json);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});