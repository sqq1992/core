/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/27
 */

/*global define, require, exports, module, app, _, $, console*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var model = new Model('getOrder');
    model.api = '/sources/order/latestOrder';
    model.type = 'get';

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {

            model.data = json;

            if (_.isFunction(cb)) {
                cb(json);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});