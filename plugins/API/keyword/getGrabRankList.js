/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 16-5-5.
 */


/*global app, _, $, console, JSONTree, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');
    var CONFIG = require('CONFIG');

    var model = new Model('getGrabRankList');
    model.api = '/sources/grabRank/list';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

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

    function  formatData(obj) {
        _.each(obj.campaignMap, function (elem) {
            elem.grabStatusStr = utils.getStatus(elem);

            elem.isHmi = CONFIG.mandate.hmi.hasOwnProperty(elem.mandateType);
            var mandateType = elem.mandateType;
            // 人机转义
            if (elem.isHmi) {
                mandateType = CONFIG.mandate.hmi[mandateType];
            }

            elem.tag = CONFIG.mandate.tag[mandateType];
            elem.clazz = CONFIG.mandate.clazz[mandateType];
        });

        _.each(obj.grabRankKeywordVOs, function (elem) {
            elem.report = utils.selfFormatData(elem.detailReportVO.summary);
            elem.report = utils.getReportByImpression(elem.report, CONFIG.keywordReports);
            elem.task.lastTime = moment(elem.task.lastExecuteTime).format('YYYY-MM-DD HH:mm:ss');
            elem.detail = formatDetail(utils.getDetailData(elem.keywordId, elem.detailReportVO, '1', 'keywordId', CONFIG.grabRankReports, '', true));
        });

        return obj;
    }

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {

            var result = formatData(json.data);
            console.log(result);
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