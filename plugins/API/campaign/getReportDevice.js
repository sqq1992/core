/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/3/25
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getReportDevice');
    model.api = '/sources/campaign/{campaignId}/reports/separations/device';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'fromDate': 'String',
        'toDate': 'String'
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json;

            _data.data.mobileReports.forEach(function (elem) {
                elem = utils.selfFormatData(elem);
            });

            _data.data.pcReports.forEach(function (elem) {
                elem = utils.selfFormatData(elem);
            });

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