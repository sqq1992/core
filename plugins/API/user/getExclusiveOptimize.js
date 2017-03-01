/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/4/7
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');

    var model = new Model('getExclusiveOptimize');
    model.api = '/sources/exclusiveOptimize';
    model.type = 'get';

    model._success = function (json, cb, isFormat) {
        if (json.success) {

            var result = json;

            if (isFormat) {
                result = json.data;
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