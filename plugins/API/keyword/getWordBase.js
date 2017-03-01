/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/21
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getWordBase');
    model.api = '/sources/wordBase';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'words': 'String'
    };

    function formatData(obj) {
        var arr = [];
        _.each(obj, function (elem) {
            arr.push(elem);
        });
        return arr;
    }


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.words) {
            throw new window.Error("API.keyword.getWordBase: *缺少参数：words");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.wordsdataMap;

            _data = formatData(_data);

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