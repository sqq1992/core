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
    model.api = '/sources/keywords/detailData';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'isYesterdayDate': 'BooleaN',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    function dataFormat(arr) {
        var temp = null,
            _o = null,
            result = {};
        arr.forEach(function (elem) {
            // 细分数据
            temp = {};
            temp.detail = {};
            // 关闭细分数据
            temp.detailStatus = 0;
            for (var i = 1; i <= 3; i++) {
                elem.detailWordsDataVO = elem.detailWordsDataVO || {};
                if (elem.detailWordsDataVO.pcInside) {
                    elem.pcInsideWordBase = elem.detailWordsDataVO.pcInside;
                }
                if (elem.detailWordsDataVO.pcOutside) {
                    elem.pcOutsideWordBase = elem.detailWordsDataVO.pcOutside;
                }
                if (elem.detailWordsDataVO.mobileInside) {
                    elem.mobileInsideWordBase = elem.detailWordsDataVO.mobileInside;
                }
                if (elem.detailWordsDataVO.mobileOutside) {
                    elem.mobileOutsideWordBase = elem.detailWordsDataVO.mobileOutside;
                }
                if (elem.detailWordsDataVO.pcInside) {
                    elem.pcInsideReport = elem.detailReportVO.pcInside;
                }
                if (elem.detailWordsDataVO.pcOutside) {
                    elem.pcOutsideReport = elem.detailReportVO.pcOutside;
                }
                if (elem.detailWordsDataVO.mobileInside) {
                    elem.mobileInsideReport = elem.detailReportVO.mobileInside;
                }
                if (elem.detailWordsDataVO.mobileOutside) {
                    elem.mobileOutsideReport = elem.detailReportVO.mobileOutside;
                }
                _o = utils.getDetailData(elem.id, elem, i + '', 'keywordId', CONFIG.manualKeywordReports, '', true);
                temp.detail[i] = formatDetail(_o);
            }
            result[elem.id] = temp;
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
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json.data.keywordDetailInfos;
            if (isFormat) {
                _data = dataFormat(_data);
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