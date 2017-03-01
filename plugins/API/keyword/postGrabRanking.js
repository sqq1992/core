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

    var model = new Model('postGrabRanking');
    model.api = '/sources/grabRank';
    model.type = 'post';
    // ???????
    model.requestParams = {
        'adgroupId': 'Number',
        'taskId': 'Number',
        'campaignId': 'Number',
        'keywordId': 'Number',
        'numIid' : 'numIid',
        'autograb': 'Boolean',
        'everyday': 'Number',
        'expectRank': 'Number',
        'fromDate': 'Number',
        'fromTime': 'Number',
        'priceLimit': 'Number',
        'taskStatus': 'Number',
        'toDate': 'Number',
        'unachieveStrategy': 'Number',
        'platform': 'Number'
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