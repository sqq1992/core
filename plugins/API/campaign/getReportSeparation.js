/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/28
 */

/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';
    var unitData = {
        "impressions": 'Number',
        "click": 'Number',
        "cost": 'Number',
        "ctr": 'Number',
        "cvr": 'Number',
        "cpc": 'Number',
        "cpm": 'Number',
        "directPay": 'Number',
        "indirectPay": 'Number',
        "pay": 'Number',
        "directPayCount": 'Number',
        "indirectPayCount": 'Number',
        "payCount": 'Number',
        "favItemCount": 'Number',
        "favShopCount": 'Number',
        "favCount": 'Number',
        "realRoi": 'Number',
        "favRoi": 'Number',
        "avgPos": 'Number',
        "cartTotal": 'Number',
        "directCartTotal": 'Number',
        "indirectCartTotal": 'Number'
    };

    var Model = require('model');
    var utils = require('utils');


    var model = new Model('getReportSeparation');
    model.api = '/sources/campaign/{campaignId}/reports/separations';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'fromDate': 'String',
        'toDate': 'String'
    };


    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var result = json;
            if (isFormat) {
                var arr = [];
                if (_.isArray(result.data.reports)) {
                    result.data.reports.forEach(function (elem) {
                        arr.push(utils.selfFormatData(utils.copyByfirst(unitData, elem)));
                    });
                    result = arr;
                }
            }
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