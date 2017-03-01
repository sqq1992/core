/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/3/11
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    // 获得用户的id对应的key 与卖家联动
    var Model = require('model');

    var model = new Model('');
    model.api = '/sources/users/authCode';
    model.type = 'get';


    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data;

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