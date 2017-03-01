/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 15/11/13
 */


/*global app, _, $, define, console, JSONTree, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');
    var CONFIG = require('CONFIG');
    var model = new Model('getSeparate');
    model.api = '/sources/reports/adgroups/separate';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'adgroupIds': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    function dataFormat(data) {
        var temp = null,
            _o = null,
            result = {},
            adgroupIds = app.cache.getParams('adgroupIds'),
            arr = adgroupIds ? adgroupIds.split(',') : [];
        arr.forEach(function (elem) {
            // 细分数据
            temp = {};
            temp.detail = {};
            // 关闭细分数据
            var dt = data.detailReports[elem];
            temp.detailStatus = 0;
            for (var i = 1; i <= 3; i++) {
                _o = utils.getDetailData(elem, dt, i + '', 'adgroupId', CONFIG.campaignReports, '', false);
                temp.detail[i] = formatDetail(_o);
            }
            result[elem] = temp;
        });
        return result;
    }

    function formatDetail(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            var obj = {};
            for (var j = 0; j < arr[i].report.length; j++) {
                var t = arr[i].report[j];
                obj[t.type] = t.dataValue;
            }
            obj.title = arr[i].title;
            result.push(obj);
        }
        return result;
    }

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.adgroupIds) {
            throw new window.Error("API.adGroup.getSeparate: *缺少参数：adgroupIds");
        }

        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json;
            if (isFormat) {
                _data = dataFormat(json.data);
            }
            if (_.isFunction(cb)) {
                cb(_data);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({
                    success: false
                });
            }
        }
    };

    module.exports = model.entry;
});