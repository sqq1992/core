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

    var model = new Model('getGrabRanking');
    model.api = '/sources/grabRank';
    model.type = 'get';
    model.requestParams = {
        'adgroupId': 'Number',
        'keywordId': 'Number'
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.grabRankTask;

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