/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/2/16
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('delNeverWords');
    model.api = '/sources/blackKeywords/neverPutKeywords';
    model.type = 'delete';
    // ÇëÇó²ÎÊý
    model.requestParams = {
        'word': 'Array',
        'adgroupId': 'Number',
        'campaignId': 'Number',
        'matchPattern': 'Number'
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