/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/26
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('putCampaignInfo');
    model.api = '/sources/hostingCampaignInfo';
    model.type = 'put';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'engineNo': 'Number',
        'engineType': 'Number',
        'dailyBudget': 'Number',
        'wordPriceLimit': 'Number',
        'customizeTitle': 'String',
        'isSetNoSearch': 'boolean',
        'isSetSchedule': 'boolean',
        'isSetArea': 'boolean',
        'isSetCreativeTitle': 'boolean',
        'isSetSmooth': 'boolean',
        'isSetMobileDiscount': 'boolean',
        'isSetMobileOuter': 'boolean',
        'isSetActivitiesNoSearch': 'boolean',
        'isSetActivitiesSchedule': 'boolean',
        'isSetActivitiesOuterDiscount': 'boolean',
        'isSetActivitiesMobileDiscount': 'boolean',
        'isInitBidNotOptimize': 'boolean',
        'isAllAdgroupsNotMandate': 'boolean',
        'itemCreativeCount' : 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.engineNo) {
            throw new window.Error("API.adgroup.putCampaignInfo: *缺少参数：engineNo");
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