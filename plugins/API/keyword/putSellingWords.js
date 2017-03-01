/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/7
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');

    var model = new Model('putSellingWords');
    model.api = '/sources/extensionKeywords/new';
    model.type = 'put';
    // 请求参数
    model.requestParams = {
        'adgroupId': 'Number',
        'campaignId': 'Number',
        'word': 'Number',
        'isOverWrite': 'Number',
        'onlyGenerateExtend': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */

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