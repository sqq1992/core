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

    var model = new Model('getRankingLimit');
    model.api = '/sources/users/autoGrabStatus';
    model.type = 'get';

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.autoGrabStatus;
            var arr = _data.split('/');
            _data = {
                'total': +arr[1],
                'num': +arr[0],
                'autoGrabStatus' : _data,
                'countDown' : json.data.countDown
            };

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