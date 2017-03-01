/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/23
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');

    var model = new Model('getSuggestMaxPrice');
    model.api = '/sources/defaultPrices/campaigns';
    model.type = 'get';

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