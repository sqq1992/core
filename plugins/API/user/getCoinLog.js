/**
 * Created by Administrator on 2016/5/23.
 */
define(function (require, exports, module) {
    'use strict';
    var Model = require('model');
    var model = new Model('getCoinLog');
    model.api = '/sources/u/coin/log';
    model.type = 'post';
    model.requestParams = {
        'nick': 'String',
        'page': 'Number',
        'pageSize': 'Number'
    };
    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.rlt == 1) {
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