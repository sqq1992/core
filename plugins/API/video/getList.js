/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/22
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getList');
    model.api = '/sources/videos';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'type': 'Number',
        'category': 'Number',
        'pageSize': 'Number',
        'pageNo': 'Number'
    };


    function format(json) {
        var _arr = [];
        json.data.videos.forEach(function (elem) {
            _arr = elem.title.split('讲师：');
            if (elem.lecturer) {
                elem.author = elem.lecturer;
            } else {
                if (_arr[1]) {
                    elem.author = _arr[1];
                }
            }

            elem.title = _arr[0];
        });
        return json;
    }


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.type) {
            throw new window.Error("API.video.getList: *缺少参数：type");
        }

        if (!requestParams.category) {
            throw new window.Error("API.video.getList: *缺少参数：category");
        }

        if (!requestParams.pageSize) {
            throw new window.Error("API.video.getList: *缺少参数：pageSize");
        }

        if (!requestParams.pageNo) {
            throw new window.Error("API.video.getList: *缺少参数：pageNo");
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