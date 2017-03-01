/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/13
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');
    var CONFIG = require('CONFIG');

    var unitData = {
        href: '',
        tag: '',
        key: '',
        clazz: '',
        budget: '',         // 日限额
        campaignId: '',     // 计划ID
        engineNo: '',       // 引擎编号
        isMandate: '',      // 是否托管（是否优化）
        mandateType: '',    // 策略编号
        onlineStatus: '',   // 计划推广状态
        report: {},         // 计划报表信息
        gmtCreate: '',
        mobileInsideReport: null,
        pcInsideReport: null,
        pcOutsideReport: null,
        mobileOutsideReport: null,
        settleReason: '',   // 计划诊断信息
        title: '',           // 标题
        isHmi: '',
        name : ''
    };

    var model = new Model('getList');
    model.api = '/sources/campaign';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.fromDate) {
            requestParams.fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.toDate) {
            requestParams.toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        app.cache.addParams('request', requestParams);
    };

    // TODO 处理细分数据接口返回来的数据
    function formatDetail (arr) {
        var result = [], i, j, t, obj;
        for (i =0; i< arr.length; i ++) {
            obj = {};
            for (j = 0 ; j < arr[i].report.length;  j ++) {
                t = arr[i].report[j];
                obj[t.type] = t.dataValue;
            }
            obj.title = arr[i].title;
            result.push(obj);
        }
        return result;
    }

    function format(o) {
        switch (o.onlineStatus) {
        case 'offline':
            o.switzh = 'off';
            break;
        case 'online':
            o.switzh = 'on';
            break;
        }
        // o.tag = CONFIG.mandate.tag[o.mandateType];
        if (o.isMandate) {
            o.note = '已使用' + o.name;
        }

        // 细分数据
        var dt = null, i;
        o.detail = {};
        // 关闭细分数据
        o.detailStatus = 0;
        for (i = 1; i <= 3; i++) {
            dt = utils.getDetailData(o.campaignId, o, i + '', 'campaignId', CONFIG.reports, '', false);
            o.detail[i] = formatDetail(dt);
        }

        return o;
    }

    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json.data.campaigns;
            var temp;
            _.each(_data, function (element) {
                element.isHmi = CONFIG.mandate.hmi.hasOwnProperty(element.mandateType);
                var mandateType = element.mandateType;
                // 人机转义
                if (element.isHmi) {
                    mandateType = CONFIG.mandate.hmi[mandateType];
                }
                element.tag = CONFIG.mandate.tag[mandateType];
                element.clazz = CONFIG.mandate.clazz[mandateType];
                element.name = CONFIG.mandate.name[mandateType];

                element.report = utils.selfFormatData(element.report);
                element.report = utils.getReportByImpression(element.report, CONFIG.reports);

                if (_.isNumber(element.gmtCreate)) {
                    element.gmtCreate = moment(element.gmtCreate).format('YYYY-M-D HH:mm');
                }
                if (element.mandateType !== -1) {
                    element.href = '#list?campaignId=' + element.campaignId + '&engineNo=' + element.engineNo + '&engineType=' + element.mandateType;
                } else {
                    element.href = '#manuallist?campaignId=' + element.campaignId;
                }
            });

            // 是否启动内部数据处理
            if (isFormat) {
                var result = [];

                // 有数据处理，否则返回空数组
                if (_.isArray(_data)) {
                    _.each(_data, function (element) {
                        temp = utils.copyByfirst(unitData, element);
                        temp = format(temp);
                        result.push(temp);
                    });
                }
                _data = result;
            }

            model.data = _data;

            console.log(_data);
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