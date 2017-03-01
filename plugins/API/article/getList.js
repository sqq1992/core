/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/22
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    function format (json) {
        json.data.articles.forEach(function (elem) {
            elem.code = parseInt(elem.code, 10);
        });
        return json;
    }

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getList');
    model.api = '/sources/articles';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'belong': 'Number',
        'pageNo': 'Number',
        'pageSize': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.belong) {
            throw new window.Error("API.article.getList: *缺少参数：belong");
        }

        if (!requestParams.pageNo) {
            throw new window.Error("API.article.getList: *缺少参数：pageNo");
        }

        if (!requestParams.pageSize) {
            throw new window.Error("API.article.getList: *缺少参数：pageSize");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json;

            if (isFormat) {
                _data = format(_data);
            }

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