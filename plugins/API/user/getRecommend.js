/**
 * Created by Administrator on 2016/5/23.
 */
define(function (require, exports, module) {
    'use strict';
    var Model = require('model');
    var model = new Model('getRecommend');
    model.api = '/sources/promotion/records';
    model.type = 'get';
    model.requestParams = {
        'type': 'Number'
    };
    /**
     * 请求成功回调函数
     * @private
     */
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