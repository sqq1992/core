/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/28
 */

/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getPlatform');
    model.api = '/sources/campaign/{campaignId}/platforms';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number'
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb) {
        if (json.success) {
            if (_.isFunction(cb)) {
                cb(json.data);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});