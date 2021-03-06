/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/27
 */
/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';
    var unitData = {
        "impressions" : 'Number',
        "click" : 'Number',
        "cost" : 'Number',
        "ctr" : 'Number',
        "cvr" : 'Number',
        "cpc" : 'Number',
        "cpm" : 'Number',
        "directPay" : 'Number',
        "indirectPay" : 'Number',
        "pay" : 'Number',
        "directPayCount" : 'Number',
        "indirectPayCount" : 'Number',
        "payCount" : 'Number',
        "favItemCount" : 'Number',
        "favShopCount" : 'Number',
        "favCount" : 'Number',
        "realRoi" : 'Number',
        "favRoi" : 'Number',
        "avgPos" : 'Number',
        "cartTotal" : 'Number',
        "directCartTotal" : 'Number',
        "indirectCartTotal" : 'Number'
    };

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getReportSeparation');
    model.api = '/sources/accounts/reports/separation';
    model.type = 'get';
    model.requestParams = {
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.fromDate) {
            requestParams.fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        }

        if (!requestParams.toDate) {
            requestParams.toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
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
            if (isFormat) {
                var arr = [];
                if (_.isArray(result.data.reports)) {
                    result.data.reports.forEach(function (elem) {
                        arr.push(utils.selfFormatData(utils.copyByfirst(unitData, elem)));
                    });
                    result = arr;
                }
            }

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