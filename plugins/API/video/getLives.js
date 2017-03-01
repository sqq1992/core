/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/3/8
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getLives');
    model.api = '/sources/lives';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'type': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.type) {
            throw new window.Error("API.video.getLives: *缺少参数：type");
        }

        app.cache.addParams('request', requestParams);
    };

    function dataFormat(data) {
        data.courseTrailerTmp = data.forecast.split(';');
        data.liveTime = moment(data.courseTime).format('YYYY-MM-DD HH:mm');
        return data;
    }

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.lives;
            _data.forEach(function (elem) {
                elem = dataFormat(elem);
            })
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