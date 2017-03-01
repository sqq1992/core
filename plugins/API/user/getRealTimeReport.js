/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/19
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');

    var model = new Model('getRealTimeReport');
    model.api = '/sources/reports/cust/realTime/api';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'fromDate': 'Number',
        'toDate': 'Number'
    };


    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.reports;

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