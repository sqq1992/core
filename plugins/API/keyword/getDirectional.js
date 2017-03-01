/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/17
 */
/*global app, _, $, console, JSONTree, moment*/
define(function(require, exports, module) {
    'use strict';
    var Model = require('model');
    var Utils = require('utils');

    var report = {
        "impressions": 'Number',
        "click": 'Number',
        "cost": 'Number',
        "ctr": 'Number',
        "cvr": 'Number',
        "cpc": 'Number',
        "cpm": 'Number',
        "directPay": 'Number',
        "indirectPay": 'Number',
        "pay": 'Number',
        "directPayCount": 'Number',
        "indirectPayCount": 'Number',
        "payCount": 'Number',
        "favItemCount": 'Number',
        "favShopCount": 'Number',
        "favCount": 'Number',
        "realRoi": 'Number',
        "favRoi": 'Number',
        "avgPos": 'Number',
        "cartTotal": 'Number',
        "directCartTotal": 'Number',
        "indirectCartTotal": 'Number'
    };

    // ��ö�������
    var model = new Model('getDirectional');
    model.api = '/sources/reports/adgroups/noSearch';
    model.type = 'get';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function(requestParams) {
        requestParams = Utils.formatOptionalParams(requestParams);
        if (!requestParams.fromDate) {
            requestParams.fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.toDate) {
            requestParams.toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getList: *ȱ�ٲ�����campaignId");
        }

        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getList: *ȱ�ٲ�����adgroupId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function(json, cb, isFormat) {
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