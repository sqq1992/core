/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/25
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getPrice');
    model.api = '/sources/keywords/priceInfo?campaignId={campaignId}&price=1';
    model.type = 'get';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number'
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.keywordPriceInfo;

            model.data = _data;

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