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

    var model = new Model('getOnceGrabRanking');
    model.api = '/sources/grabRank/trigger';
    model.type = 'get';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'keywordId': 'Number'
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